// scripts/seed-demo.js — optional: fills the DB with demo users + 14 days of tracker logs
// Run:  npm run seed      (safe to run twice — existing demo emails are skipped)
const bcrypt = require("bcryptjs");
const { init, prepare, transaction, computeBMI, localDate } = require("../config/db");

const demo = [
  ["Ravi Kumar","ravi@demo.com",28,72,175,"male","Bengaluru","moderate","maintain","vegetarian","none"],
  ["Ananya Gowda","ananya@demo.com",24,58,160,"female","Mysuru","light","lose","vegetarian","pcod"],
  ["Suresh Patil","suresh@demo.com",45,84,170,"male","Belagavi","light","lose","non-vegetarian","diabetes,hypertension"],
  ["Lakshmi Hegde","lakshmi@demo.com",36,52,158,"female","Coastal Karnataka","moderate","gain","non-vegetarian","anemia"],
  ["Manjunath S","manju@demo.com",52,78,168,"male","North Karnataka","sedentary","maintain","vegetarian","cholesterol"],
  ["Divya Shetty","divya@demo.com",30,49,162,"female","Mangaluru","active","gain","non-vegetarian","thyroid"],
];

(async () => {
  await init();
  const hash = bcrypt.hashSync("Demo@1234", 10);
  const types = ["breakfast", "lunch", "dinner", "snack"];
  let created = 0;
  transaction(() => {
    demo.forEach(([name, email, age, w, h, gender, region, act, goal, diet, cond], idx) => {
      if (prepare("SELECT id FROM users WHERE email=?").get(email)) return;
      const { bmi, bodyType } = computeBMI(w, h);
      const id = prepare(`INSERT INTO users (name,email,password,age,weight,height,gender,region,activity_level,goal,diet_type,medical_conditions,bmi,body_type,last_login)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))`)
        .run(name, email, hash, age, w, h, gender, region, act, goal, diet, cond, bmi, bodyType).lastInsertRowid;
      created++;
      for (let d = 0; d < 14; d++) {
        if ((d + idx) % 5 === 4) continue;                       // a few missed days
        const date = new Date(); date.setDate(date.getDate() - d);
        const row = {}; let total = 0;
        types.forEach((t, i) => {
          const m = prepare("SELECT name,calories FROM meals WHERE diet_type=? AND goal=? AND meal_type=? ORDER BY id LIMIT 1 OFFSET ?")
            .get(diet, goal, t, (d + i) % 2);
          const done = (d + i + idx) % 4 !== 0 ? 1 : 0;
          if (m) { row[t] = [m.name, m.calories, done]; if (done) total += m.calories; }
        });
        prepare(`INSERT INTO trackers (user_id,date,breakfast_name,breakfast_cal,breakfast_done,lunch_name,lunch_cal,lunch_done,
          dinner_name,dinner_cal,dinner_done,snack_name,snack_cal,snack_done,water_intake,total_calories,notes)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
          .run(id, localDate(date), ...types.flatMap((t) => row[t] || [null, 0, 0]), 4 + ((d + idx) % 5), total, "");
      }
    });
    if (prepare("SELECT COUNT(*) c FROM messages").get().c === 0) {
      prepare("INSERT INTO messages (name,email,subject,message) VALUES (?,?,?,?)")
        .run("Kavya R", "kavya@example.com", "Kannada support", "Great that the app supports Kannada! Could you add more Malnad recipes?");
      prepare("INSERT INTO messages (name,email,subject,message) VALUES (?,?,?,?)")
        .run("Prakash N", "prakash@example.com", "Diabetes plan", "Does the diabetes plan avoid ragi malt with jaggery?");
    }
  });
  console.log(`✅ Demo data ready — ${created} new users (password for all: Demo@1234)`);
  process.exit(0);
})();
