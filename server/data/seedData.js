// data/seedData.js — Karnataka meal catalogue + medical guidelines (English + Kannada)
// This file is only used to SEED the SQLite database on first run.
// After that, the app reads everything from the database (tables: meals, conditions).

const plans = {
  vegetarian: {
    lose: {
      breakfast: [
        { name:"Ragi Mudde with Sambar",          calories:220, description:"Finger millet balls with lentil soup — high fibre, low fat",    tags:["ragi","low glycemic","iron rich"] },
        { name:"Akki Roti with Coconut Chutney",  calories:180, description:"Rice flour flatbread with fresh coconut chutney",               tags:["rice","gluten free"] },
        { name:"Avalakki Upma",                   calories:160, description:"Poha upma with vegetables and mustard tempering",               tags:["light","low fat"] },
        { name:"Idli with Tomato Chutney",        calories:150, description:"Steamed rice cakes — light and nutritious",                     tags:["steamed","low fat","gluten free"] },
        { name:"Jolada Roti with Methi Chutney",  calories:190, description:"Jowar flatbread with fenugreek chutney — diabetic friendly",    tags:["jowar","low glycemic","diabetes friendly"] },
      ],
      lunch: [
        { name:"Jolada Roti with Dal",            calories:320, description:"Jowar flatbread with protein-rich lentil curry",                tags:["jowar","low glycemic","high protein"] },
        { name:"Brown Rice with Rasam & Palya",   calories:350, description:"Brown rice, pepper rasam and stir-fried vegetables",            tags:["brown rice","low fat"] },
        { name:"Ragi Sankati with Soppu Saaru",   calories:300, description:"Ragi porridge with greens curry — iron rich",                   tags:["ragi","iron rich","anemia friendly"] },
        { name:"Hurali Saaru with Rice",          calories:310, description:"Horse gram curry — excellent for anemia and weight loss",       tags:["horse gram","iron rich","high protein"] },
      ],
      dinner: [
        { name:"Vegetable Saaru with Ragi Mudde", calories:250, description:"Light vegetable curry with finger millet balls",                tags:["ragi","low fat"] },
        { name:"Mosaru Bajji",                    calories:200, description:"Yogurt-based curry — cooling and probiotic-rich",               tags:["probiotic","dairy"] },
        { name:"Akki Roti with Raita",            calories:220, description:"Rice roti with cucumber yogurt",                                tags:["gluten free","dairy"] },
        { name:"Bitter Gourd Palya with Ragi Roti",calories:210,description:"Karela stir fry — excellent for diabetes management",           tags:["diabetes friendly","low glycemic"] },
      ],
      snack: [
        { name:"Roasted Groundnuts",              calories:120, description:"Karnataka-style spiced peanuts — protein snack",                tags:["protein","low carb"] },
        { name:"Tender Coconut Water",            calories:45,  description:"Natural electrolytes — great for BP and hydration",             tags:["low sodium","hypertension friendly"] },
        { name:"Cucumber Kosambari",              calories:80,  description:"Fresh cucumber and lentil salad",                               tags:["low calorie","kidney friendly"] },
        { name:"Sprouted Moong Salad",            calories:90,  description:"Sprouted green gram with lemon — iron and vitamin C",           tags:["iron rich","vitamin C","anemia friendly"] },
      ],
    },
    maintain: {
      breakfast: [
        { name:"Masala Dosa with Sambar",         calories:320, description:"Crispy rice crepe with spiced potato filling",                  tags:["gluten free","rice based"] },
        { name:"Rava Idli with Chutney",          calories:280, description:"Semolina steamed cakes with chutneys",                          tags:["steamed"] },
        { name:"Bisi Bele Bath",                  calories:350, description:"Hot lentil rice with vegetables and spices",                    tags:["protein rich","balanced"] },
        { name:"Set Dosa with Saagu",             calories:300, description:"Soft thick dosas with mixed vegetable curry",                   tags:["gluten free"] },
        { name:"Ragi Dosa with Coconut Chutney",  calories:260, description:"Nutritious finger millet dosa",                                 tags:["ragi","iron rich","low glycemic"] },
      ],
      lunch: [
        { name:"Karnataka Thali",                 calories:650, description:"Rice, sambar, rasam, palya, kosambari, papad, pickle",          tags:["balanced","traditional"] },
        { name:"Vangi Bath with Raita",           calories:480, description:"Spiced brinjal rice with yogurt",                               tags:["balanced"] },
        { name:"Chitranna with Majjige Huli",     calories:420, description:"Lemon rice with buttermilk curry — cooling",                    tags:["probiotic","gluten free"] },
        { name:"Saaru Rice with Palya",           calories:440, description:"Tamarind based rasam rice with stir-fried greens",              tags:["iron rich"] },
      ],
      dinner: [
        { name:"Roti with Enne Badnekai",         calories:380, description:"Wheat roti with stuffed brinjal curry",                         tags:["balanced"] },
        { name:"Rice with Huli & Palya",          calories:400, description:"Rice with tamarind sambar and stir-fry",                        tags:["balanced","traditional"] },
        { name:"Neer Dosa with Coconut Milk Curry",calories:360,description:"Thin rice crepes with mild coconut curry",                      tags:["gluten free","lactose free"] },
      ],
      snack: [
        { name:"Kodubale",                        calories:150, description:"Crispy ring-shaped Karnataka snack",                            tags:["traditional"] },
        { name:"Chakkuli",                        calories:140, description:"Spiral rice flour snack — gluten free",                         tags:["gluten free","rice based"] },
        { name:"Nippatu with Tea",                calories:160, description:"Flat crispy snack with masala chai",                            tags:["traditional"] },
      ],
    },
    gain: {
      breakfast: [
        { name:"Puri with Saagu",                 calories:480, description:"Deep fried bread with rich vegetable curry",                    tags:["high calorie"] },
        { name:"Rava Kesari Bath",                calories:420, description:"Semolina halwa — energy dense sweet",                           tags:["high calorie","energy"] },
        { name:"Masala Dosa with Extra Ghee",     calories:500, description:"Dosa with generous ghee for calories",                          tags:["high calorie","dairy"] },
      ],
      lunch: [
        { name:"Full Karnataka Thali with Payasa",calories:900, description:"Complete thali with kheer dessert",                             tags:["high calorie","dairy"] },
        { name:"Puliyogare with Coconut Rice",    calories:750, description:"Tamarind rice and coconut rice combo",                          tags:["high calorie"] },
        { name:"Bisi Bele Bath with Ghee",        calories:700, description:"Lentil rice generously topped with ghee",                       tags:["high calorie","protein"] },
      ],
      dinner: [
        { name:"Roti with Paneer Curry",          calories:580, description:"Wheat roti with rich paneer gravy",                             tags:["high protein","dairy"] },
        { name:"Rice with Dalithoy & Ghee",       calories:600, description:"Rice with Coorg-style dal and ghee",                            tags:["high calorie"] },
      ],
      snack: [
        { name:"Banana Chips with Jaggery",       calories:280, description:"Karnataka-style banana chips with jaggery",                     tags:["high calorie","energy"] },
        { name:"Groundnut Chikki",                calories:250, description:"Peanut and jaggery energy bar",                                 tags:["high calorie","protein"] },
        { name:"Mango Lassi",                     calories:220, description:"Thick mango yogurt drink",                                      tags:["high calorie","dairy"] },
      ],
    },
  },
  "non-vegetarian": {
    lose: {
      breakfast: [
        { name:"Egg Dosa with Tomato Chutney",    calories:240, description:"Protein-rich egg dosa — low calorie",                           tags:["high protein","low fat"] },
        { name:"Chicken Akki Roti",               calories:260, description:"Rice roti with minced chicken filling",                         tags:["high protein","gluten free"] },
        { name:"Idli with Egg Curry",             calories:230, description:"Steamed idli with boiled egg curry",                            tags:["steamed","high protein"] },
      ],
      lunch: [
        { name:"Fish Curry with Brown Rice",      calories:380, description:"Coastal Karnataka fish curry with brown rice",                  tags:["omega 3","thyroid friendly"] },
        { name:"Chicken Saaru with Ragi Mudde",   calories:350, description:"Spiced chicken curry with ragi balls",                          tags:["high protein","ragi"] },
        { name:"Prawn Gassi with Rice",           calories:370, description:"Mangalorean prawn curry with steamed rice",                     tags:["seafood","coastal"] },
      ],
      dinner: [
        { name:"Grilled Fish with Kosambari",     calories:280, description:"Grilled fish with fresh salad — thyroid friendly",              tags:["grilled","low fat","thyroid friendly"] },
        { name:"Egg Palya with Roti",             calories:300, description:"Spiced egg stir-fry with wheat roti",                           tags:["high protein"] },
        { name:"Chicken Soup with Akki Roti",     calories:260, description:"Light chicken soup with rice roti",                             tags:["low fat","gluten free"] },
      ],
      snack: [
        { name:"Boiled Eggs",                     calories:140, description:"Two boiled eggs — protein snack",                               tags:["high protein","low carb"] },
        { name:"Fish Fry (2 pieces)",             calories:160, description:"Karnataka-style shallow fried fish",                            tags:["seafood"] },
      ],
    },
    maintain: {
      breakfast: [
        { name:"Egg Masala Dosa",                 calories:380, description:"Crispy dosa with spiced egg filling",                           tags:["gluten free","high protein"] },
        { name:"Chicken Keema Roti",              calories:420, description:"Flatbread stuffed with minced chicken",                         tags:["high protein"] },
        { name:"Prawn Idli Fry",                  calories:350, description:"Pan-fried idli with prawn tempering",                           tags:["seafood"] },
      ],
      lunch: [
        { name:"Mangalorean Fish Thali",          calories:700, description:"Fish curry, rice, rasam, pickle, papad",                        tags:["coastal","omega 3"] },
        { name:"Chicken Biryani Karnataka Style", calories:680, description:"Aromatic rice with tender chicken pieces",                      tags:["high protein"] },
        { name:"Mutton Saaru with Rice",          calories:650, description:"Slow-cooked mutton curry with steamed rice",                    tags:["high protein"] },
      ],
      dinner: [
        { name:"Chicken Curry with Neer Dosa",    calories:480, description:"Thin rice crepes with spicy chicken curry",                     tags:["gluten free","high protein"] },
        { name:"Fish Fry with Akki Roti",         calories:460, description:"Spiced fish fry with soft rice roti",                           tags:["gluten free","omega 3"] },
        { name:"Egg Curry with Rice",             calories:450, description:"Karnataka egg masala with steamed rice",                        tags:["high protein"] },
      ],
      snack: [
        { name:"Chicken 65",                      calories:200, description:"Spicy fried chicken bites",                                     tags:["high protein"] },
        { name:"Fish Cutlet",                     calories:180, description:"Crispy fish patties Karnataka style",                           tags:["seafood"] },
      ],
    },
    gain: {
      breakfast: [
        { name:"Mutton Keema Dosa",               calories:560, description:"Dosa stuffed with rich mutton mince",                           tags:["high protein","high calorie"] },
        { name:"Egg Paratha with Butter",         calories:520, description:"Layered egg paratha with extra butter",                         tags:["high calorie","high protein"] },
      ],
      lunch: [
        { name:"Full Mutton Thali",               calories:950, description:"Complete thali with mutton curry, rice, dal, sides",            tags:["high calorie","high protein"] },
        { name:"Chicken Biryani with Raita",      calories:850, description:"Full portion biryani with cooling raita",                       tags:["high calorie","high protein"] },
      ],
      dinner: [
        { name:"Mutton Curry with Roti & Rice",   calories:700, description:"Rich mutton gravy with both roti and rice",                     tags:["high calorie"] },
        { name:"Prawn Biryani",                   calories:750, description:"Coastal Karnataka prawn biryani",                               tags:["high calorie","seafood"] },
      ],
      snack: [
        { name:"Chicken Sandwich",                calories:350, description:"Chicken mayo sandwich with Karnataka spices",                   tags:["high calorie","high protein"] },
        { name:"Mutton Cutlet",                   calories:280, description:"Spiced mutton patties",                                         tags:["high protein"] },
      ],
    },
  },
};

// English name -> [Kannada name, Kannada description]
const KN = {
  "Ragi Mudde with Sambar":["ರಾಗಿ ಮುದ್ದೆ ಸಾಂಬಾರ್ ಜೊತೆ","ಬೇಳೆ ಸಾರಿನೊಂದಿಗೆ ರಾಗಿ ಮುದ್ದೆ — ಹೆಚ್ಚು ನಾರು, ಕಡಿಮೆ ಕೊಬ್ಬು"],
  "Akki Roti with Coconut Chutney":["ಅಕ್ಕಿ ರೊಟ್ಟಿ ತೆಂಗಿನಕಾಯಿ ಚಟ್ನಿ ಜೊತೆ","ತಾಜಾ ತೆಂಗಿನಕಾಯಿ ಚಟ್ನಿಯೊಂದಿಗೆ ಅಕ್ಕಿ ಹಿಟ್ಟಿನ ರೊಟ್ಟಿ"],
  "Avalakki Upma":["ಅವಲಕ್ಕಿ ಉಪ್ಪಿಟ್ಟು","ತರಕಾರಿ ಮತ್ತು ಸಾಸಿವೆ ಒಗ್ಗರಣೆಯ ಅವಲಕ್ಕಿ ಉಪ್ಪಿಟ್ಟು"],
  "Idli with Tomato Chutney":["ಇಡ್ಲಿ ಟೊಮೆಟೊ ಚಟ್ನಿ ಜೊತೆ","ಹಬೆಯಲ್ಲಿ ಬೇಯಿಸಿದ ಅಕ್ಕಿ ಇಡ್ಲಿ — ಹಗುರ ಮತ್ತು ಪೌಷ್ಟಿಕ"],
  "Jolada Roti with Methi Chutney":["ಜೋಳದ ರೊಟ್ಟಿ ಮೆಂತ್ಯ ಚಟ್ನಿ ಜೊತೆ","ಮೆಂತ್ಯ ಚಟ್ನಿಯೊಂದಿಗೆ ಜೋಳದ ರೊಟ್ಟಿ — ಮಧುಮೇಹಿಗಳಿಗೆ ಸೂಕ್ತ"],
  "Jolada Roti with Dal":["ಜೋಳದ ರೊಟ್ಟಿ ಮತ್ತು ದಾಲ್","ಪ್ರೋಟೀನ್ ಭರಿತ ಬೇಳೆ ಸಾರಿನೊಂದಿಗೆ ಜೋಳದ ರೊಟ್ಟಿ"],
  "Brown Rice with Rasam & Palya":["ಕಂದು ಅಕ್ಕಿ ಅನ್ನ, ಸಾರು ಮತ್ತು ಪಲ್ಯ","ಕಂದು ಅಕ್ಕಿ ಅನ್ನ, ಮೆಣಸಿನ ಸಾರು ಮತ್ತು ತರಕಾರಿ ಪಲ್ಯ"],
  "Ragi Sankati with Soppu Saaru":["ರಾಗಿ ಸಂಗಟಿ ಸೊಪ್ಪಿನ ಸಾರು ಜೊತೆ","ಸೊಪ್ಪಿನ ಸಾರಿನೊಂದಿಗೆ ರಾಗಿ ಸಂಗಟಿ — ಕಬ್ಬಿಣಾಂಶ ಸಮೃದ್ಧ"],
  "Hurali Saaru with Rice":["ಹುರುಳಿ ಸಾರು ಅನ್ನದ ಜೊತೆ","ಹುರುಳಿಕಾಳಿನ ಸಾರು — ರಕ್ತಹೀನತೆ ಮತ್ತು ತೂಕ ಇಳಿಕೆಗೆ ಉತ್ತಮ"],
  "Vegetable Saaru with Ragi Mudde":["ತರಕಾರಿ ಸಾರು ರಾಗಿ ಮುದ್ದೆ ಜೊತೆ","ರಾಗಿ ಮುದ್ದೆಯೊಂದಿಗೆ ಹಗುರ ತರಕಾರಿ ಸಾರು"],
  "Mosaru Bajji":["ಮೊಸರು ಬಜ್ಜಿ","ಮೊಸರು ಆಧಾರಿತ ತಂಪಾದ ಖಾದ್ಯ — ಪ್ರೋಬಯಾಟಿಕ್ ಸಮೃದ್ಧ"],
  "Akki Roti with Raita":["ಅಕ್ಕಿ ರೊಟ್ಟಿ ಮತ್ತು ರಾಯತ","ಸೌತೆಕಾಯಿ ಮೊಸರು ಬಜ್ಜಿಯೊಂದಿಗೆ ಅಕ್ಕಿ ರೊಟ್ಟಿ"],
  "Bitter Gourd Palya with Ragi Roti":["ಹಾಗಲಕಾಯಿ ಪಲ್ಯ ರಾಗಿ ರೊಟ್ಟಿ ಜೊತೆ","ಹಾಗಲಕಾಯಿ ಪಲ್ಯ — ಮಧುಮೇಹ ನಿರ್ವಹಣೆಗೆ ಉತ್ತಮ"],
  "Roasted Groundnuts":["ಹುರಿದ ಕಡಲೆಕಾಯಿ","ಕರ್ನಾಟಕ ಶೈಲಿಯ ಮಸಾಲೆ ಕಡಲೆಕಾಯಿ — ಪ್ರೋಟೀನ್ ತಿಂಡಿ"],
  "Tender Coconut Water":["ಎಳನೀರು","ನೈಸರ್ಗಿಕ ಎಲೆಕ್ಟ್ರೋಲೈಟ್‌ಗಳು — ರಕ್ತದೊತ್ತಡ ಮತ್ತು ನೀರಿನಂಶಕ್ಕೆ ಉತ್ತಮ"],
  "Cucumber Kosambari":["ಸೌತೆಕಾಯಿ ಕೋಸಂಬರಿ","ತಾಜಾ ಸೌತೆಕಾಯಿ ಮತ್ತು ಬೇಳೆ ಸಲಾಡ್"],
  "Sprouted Moong Salad":["ಮೊಳಕೆ ಹೆಸರುಕಾಳು ಸಲಾಡ್","ನಿಂಬೆರಸದೊಂದಿಗೆ ಮೊಳಕೆ ಹೆಸರುಕಾಳು — ಕಬ್ಬಿಣ ಮತ್ತು ವಿಟಮಿನ್ ಸಿ"],
  "Masala Dosa with Sambar":["ಮಸಾಲೆ ದೋಸೆ ಸಾಂಬಾರ್ ಜೊತೆ","ಆಲೂಗಡ್ಡೆ ಪಲ್ಯ ತುಂಬಿದ ಗರಿಗರಿ ಅಕ್ಕಿ ದೋಸೆ"],
  "Rava Idli with Chutney":["ರವೆ ಇಡ್ಲಿ ಚಟ್ನಿ ಜೊತೆ","ಚಟ್ನಿಯೊಂದಿಗೆ ಹಬೆಯಲ್ಲಿ ಬೇಯಿಸಿದ ರವೆ ಇಡ್ಲಿ"],
  "Bisi Bele Bath":["ಬಿಸಿ ಬೇಳೆ ಬಾತ್","ತರಕಾರಿ ಮತ್ತು ಮಸಾಲೆಯೊಂದಿಗೆ ಬಿಸಿ ಬೇಳೆ ಅನ್ನ"],
  "Set Dosa with Saagu":["ಸೆಟ್ ದೋಸೆ ಸಾಗು ಜೊತೆ","ಮಿಶ್ರ ತರಕಾರಿ ಸಾಗುವಿನೊಂದಿಗೆ ಮೃದು ದಪ್ಪ ದೋಸೆ"],
  "Ragi Dosa with Coconut Chutney":["ರಾಗಿ ದೋಸೆ ತೆಂಗಿನ ಚಟ್ನಿ ಜೊತೆ","ಪೌಷ್ಟಿಕ ರಾಗಿ ದೋಸೆ"],
  "Karnataka Thali":["ಕರ್ನಾಟಕ ಊಟ (ಥಾಲಿ)","ಅನ್ನ, ಸಾಂಬಾರ್, ಸಾರು, ಪಲ್ಯ, ಕೋಸಂಬರಿ, ಹಪ್ಪಳ, ಉಪ್ಪಿನಕಾಯಿ"],
  "Vangi Bath with Raita":["ವಾಂಗಿ ಬಾತ್ ರಾಯತ ಜೊತೆ","ಮೊಸರು ಬಜ್ಜಿಯೊಂದಿಗೆ ಬದನೆಕಾಯಿ ಮಸಾಲೆ ಅನ್ನ"],
  "Chitranna with Majjige Huli":["ಚಿತ್ರಾನ್ನ ಮಜ್ಜಿಗೆ ಹುಳಿ ಜೊತೆ","ತಂಪಾದ ಮಜ್ಜಿಗೆ ಹುಳಿಯೊಂದಿಗೆ ನಿಂಬೆ ಚಿತ್ರಾನ್ನ"],
  "Saaru Rice with Palya":["ಸಾರು ಅನ್ನ ಪಲ್ಯ ಜೊತೆ","ಹುಣಸೆ ಸಾರಿನ ಅನ್ನ ಮತ್ತು ಸೊಪ್ಪಿನ ಪಲ್ಯ"],
  "Roti with Enne Badnekai":["ರೊಟ್ಟಿ ಮತ್ತು ಎಣ್ಣೆಗಾಯಿ","ಗೋಧಿ ರೊಟ್ಟಿಯೊಂದಿಗೆ ಮಸಾಲೆ ತುಂಬಿದ ಬದನೆಕಾಯಿ ಪಲ್ಯ"],
  "Rice with Huli & Palya":["ಅನ್ನ, ಹುಳಿ ಮತ್ತು ಪಲ್ಯ","ಹುಣಸೆ ಸಾಂಬಾರ್ ಮತ್ತು ಪಲ್ಯದೊಂದಿಗೆ ಅನ್ನ"],
  "Neer Dosa with Coconut Milk Curry":["ನೀರ್ ದೋಸೆ ತೆಂಗಿನ ಹಾಲಿನ ಕರಿ ಜೊತೆ","ಸೌಮ್ಯ ತೆಂಗಿನ ಹಾಲಿನ ಕರಿಯೊಂದಿಗೆ ತೆಳು ಅಕ್ಕಿ ದೋಸೆ"],
  "Kodubale":["ಕೋಡುಬಳೆ","ಕರ್ನಾಟಕದ ಗರಿಗರಿ ಉಂಗುರಾಕಾರದ ತಿಂಡಿ"],
  "Chakkuli":["ಚಕ್ಕುಲಿ","ಸುರುಳಿ ಆಕಾರದ ಅಕ್ಕಿ ಹಿಟ್ಟಿನ ತಿಂಡಿ — ಗ್ಲುಟನ್ ರಹಿತ"],
  "Nippatu with Tea":["ನಿಪ್ಪಟ್ಟು ಚಹಾ ಜೊತೆ","ಮಸಾಲಾ ಚಹಾದೊಂದಿಗೆ ಚಪ್ಪಟೆ ಗರಿಗರಿ ತಿಂಡಿ"],
  "Puri with Saagu":["ಪೂರಿ ಸಾಗು ಜೊತೆ","ಶ್ರೀಮಂತ ತರಕಾರಿ ಸಾಗುವಿನೊಂದಿಗೆ ಕರಿದ ಪೂರಿ"],
  "Rava Kesari Bath":["ರವೆ ಕೇಸರಿ ಬಾತ್","ರವೆಯ ಸಿಹಿ ಹಲ್ವಾ — ಶಕ್ತಿ ಭರಿತ"],
  "Masala Dosa with Extra Ghee":["ಮಸಾಲೆ ದೋಸೆ ಹೆಚ್ಚು ತುಪ್ಪದೊಂದಿಗೆ","ಹೆಚ್ಚು ಕ್ಯಾಲೊರಿಗಾಗಿ ತುಪ್ಪ ಹಾಕಿದ ದೋಸೆ"],
  "Full Karnataka Thali with Payasa":["ಪೂರ್ಣ ಕರ್ನಾಟಕ ಥಾಲಿ ಪಾಯಸದೊಂದಿಗೆ","ಪಾಯಸದ ಸಿಹಿಯೊಂದಿಗೆ ಸಂಪೂರ್ಣ ಊಟ"],
  "Puliyogare with Coconut Rice":["ಪುಳಿಯೋಗರೆ ಮತ್ತು ಕಾಯಿ ಅನ್ನ","ಹುಣಸೆ ಅನ್ನ ಮತ್ತು ತೆಂಗಿನಕಾಯಿ ಅನ್ನದ ಸಂಯೋಜನೆ"],
  "Bisi Bele Bath with Ghee":["ತುಪ್ಪದೊಂದಿಗೆ ಬಿಸಿ ಬೇಳೆ ಬಾತ್","ಹೇರಳ ತುಪ್ಪ ಹಾಕಿದ ಬೇಳೆ ಅನ್ನ"],
  "Roti with Paneer Curry":["ರೊಟ್ಟಿ ಪನೀರ್ ಕರಿ ಜೊತೆ","ಶ್ರೀಮಂತ ಪನೀರ್ ಗ್ರೇವಿಯೊಂದಿಗೆ ಗೋಧಿ ರೊಟ್ಟಿ"],
  "Rice with Dalithoy & Ghee":["ಅನ್ನ, ದಾಲಿತೋಯ್ ಮತ್ತು ತುಪ್ಪ","ಕೊಡಗು ಶೈಲಿಯ ಬೇಳೆ ಮತ್ತು ತುಪ್ಪದೊಂದಿಗೆ ಅನ್ನ"],
  "Banana Chips with Jaggery":["ಬಾಳೆಕಾಯಿ ಚಿಪ್ಸ್ ಬೆಲ್ಲದೊಂದಿಗೆ","ಬೆಲ್ಲದೊಂದಿಗೆ ಕರ್ನಾಟಕ ಶೈಲಿಯ ಬಾಳೆಕಾಯಿ ಚಿಪ್ಸ್"],
  "Groundnut Chikki":["ಕಡಲೆಕಾಯಿ ಚಿಕ್ಕಿ","ಕಡಲೆಕಾಯಿ ಮತ್ತು ಬೆಲ್ಲದ ಶಕ್ತಿ ಬಾರ್"],
  "Mango Lassi":["ಮಾವಿನ ಲಸ್ಸಿ","ದಪ್ಪ ಮಾವಿನ ಮೊಸರು ಪಾನೀಯ"],
  "Egg Dosa with Tomato Chutney":["ಮೊಟ್ಟೆ ದೋಸೆ ಟೊಮೆಟೊ ಚಟ್ನಿ ಜೊತೆ","ಪ್ರೋಟೀನ್ ಭರಿತ ಮೊಟ್ಟೆ ದೋಸೆ — ಕಡಿಮೆ ಕ್ಯಾಲೊರಿ"],
  "Chicken Akki Roti":["ಚಿಕನ್ ಅಕ್ಕಿ ರೊಟ್ಟಿ","ಕೊಚ್ಚಿದ ಕೋಳಿ ಮಾಂಸ ತುಂಬಿದ ಅಕ್ಕಿ ರೊಟ್ಟಿ"],
  "Idli with Egg Curry":["ಇಡ್ಲಿ ಮೊಟ್ಟೆ ಕರಿ ಜೊತೆ","ಬೇಯಿಸಿದ ಮೊಟ್ಟೆ ಕರಿಯೊಂದಿಗೆ ಹಬೆ ಇಡ್ಲಿ"],
  "Fish Curry with Brown Rice":["ಮೀನು ಸಾರು ಕಂದು ಅಕ್ಕಿ ಜೊತೆ","ಕರಾವಳಿ ಕರ್ನಾಟಕದ ಮೀನು ಸಾರು, ಕಂದು ಅಕ್ಕಿ ಅನ್ನದೊಂದಿಗೆ"],
  "Chicken Saaru with Ragi Mudde":["ಚಿಕನ್ ಸಾರು ರಾಗಿ ಮುದ್ದೆ ಜೊತೆ","ರಾಗಿ ಮುದ್ದೆಯೊಂದಿಗೆ ಖಾರದ ಕೋಳಿ ಸಾರು"],
  "Prawn Gassi with Rice":["ಸಿಗಡಿ ಗಸಿ ಅನ್ನದ ಜೊತೆ","ಮಂಗಳೂರು ಶೈಲಿಯ ಸಿಗಡಿ ಗಸಿ, ಬಿಸಿ ಅನ್ನದೊಂದಿಗೆ"],
  "Grilled Fish with Kosambari":["ಸುಟ್ಟ ಮೀನು ಕೋಸಂಬರಿ ಜೊತೆ","ತಾಜಾ ಸಲಾಡ್‌ನೊಂದಿಗೆ ಗ್ರಿಲ್ ಮಾಡಿದ ಮೀನು — ಥೈರಾಯ್ಡ್‌ಗೆ ಉತ್ತಮ"],
  "Egg Palya with Roti":["ಮೊಟ್ಟೆ ಪಲ್ಯ ರೊಟ್ಟಿ ಜೊತೆ","ಗೋಧಿ ರೊಟ್ಟಿಯೊಂದಿಗೆ ಮಸಾಲೆ ಮೊಟ್ಟೆ ಪಲ್ಯ"],
  "Chicken Soup with Akki Roti":["ಚಿಕನ್ ಸೂಪ್ ಅಕ್ಕಿ ರೊಟ್ಟಿ ಜೊತೆ","ಅಕ್ಕಿ ರೊಟ್ಟಿಯೊಂದಿಗೆ ಹಗುರ ಕೋಳಿ ಸೂಪ್"],
  "Boiled Eggs":["ಬೇಯಿಸಿದ ಮೊಟ್ಟೆ","ಎರಡು ಬೇಯಿಸಿದ ಮೊಟ್ಟೆ — ಪ್ರೋಟೀನ್ ತಿಂಡಿ"],
  "Fish Fry (2 pieces)":["ಮೀನು ಫ್ರೈ (2 ತುಂಡು)","ಕರ್ನಾಟಕ ಶೈಲಿಯ ಹಗುರ ಕರಿದ ಮೀನು"],
  "Egg Masala Dosa":["ಮೊಟ್ಟೆ ಮಸಾಲೆ ದೋಸೆ","ಮಸಾಲೆ ಮೊಟ್ಟೆ ತುಂಬಿದ ಗರಿಗರಿ ದೋಸೆ"],
  "Chicken Keema Roti":["ಚಿಕನ್ ಕೀಮಾ ರೊಟ್ಟಿ","ಕೊಚ್ಚಿದ ಕೋಳಿ ತುಂಬಿದ ರೊಟ್ಟಿ"],
  "Prawn Idli Fry":["ಸಿಗಡಿ ಇಡ್ಲಿ ಫ್ರೈ","ಸಿಗಡಿ ಒಗ್ಗರಣೆಯೊಂದಿಗೆ ಹುರಿದ ಇಡ್ಲಿ"],
  "Mangalorean Fish Thali":["ಮಂಗಳೂರು ಮೀನು ಊಟ","ಮೀನು ಸಾರು, ಅನ್ನ, ಸಾರು, ಉಪ್ಪಿನಕಾಯಿ, ಹಪ್ಪಳ"],
  "Chicken Biryani Karnataka Style":["ಕರ್ನಾಟಕ ಶೈಲಿ ಚಿಕನ್ ಬಿರಿಯಾನಿ","ಕೋಮಲ ಕೋಳಿ ತುಂಡುಗಳೊಂದಿಗೆ ಪರಿಮಳಯುಕ್ತ ಅನ್ನ"],
  "Mutton Saaru with Rice":["ಮಟನ್ ಸಾರು ಅನ್ನದ ಜೊತೆ","ನಿಧಾನವಾಗಿ ಬೇಯಿಸಿದ ಮಟನ್ ಸಾರು, ಬಿಸಿ ಅನ್ನದೊಂದಿಗೆ"],
  "Chicken Curry with Neer Dosa":["ಚಿಕನ್ ಕರಿ ನೀರ್ ದೋಸೆ ಜೊತೆ","ಖಾರದ ಚಿಕನ್ ಕರಿಯೊಂದಿಗೆ ತೆಳು ಅಕ್ಕಿ ದೋಸೆ"],
  "Fish Fry with Akki Roti":["ಮೀನು ಫ್ರೈ ಅಕ್ಕಿ ರೊಟ್ಟಿ ಜೊತೆ","ಮೃದು ಅಕ್ಕಿ ರೊಟ್ಟಿಯೊಂದಿಗೆ ಮಸಾಲೆ ಮೀನು ಫ್ರೈ"],
  "Egg Curry with Rice":["ಮೊಟ್ಟೆ ಕರಿ ಅನ್ನದ ಜೊತೆ","ಬಿಸಿ ಅನ್ನದೊಂದಿಗೆ ಕರ್ನಾಟಕ ಮೊಟ್ಟೆ ಮಸಾಲೆ"],
  "Chicken 65":["ಚಿಕನ್ 65","ಖಾರದ ಕರಿದ ಕೋಳಿ ತುಂಡುಗಳು"],
  "Fish Cutlet":["ಮೀನು ಕಟ್ಲೆಟ್","ಕರ್ನಾಟಕ ಶೈಲಿಯ ಗರಿಗರಿ ಮೀನು ಕಟ್ಲೆಟ್"],
  "Mutton Keema Dosa":["ಮಟನ್ ಕೀಮಾ ದೋಸೆ","ಶ್ರೀಮಂತ ಮಟನ್ ಕೀಮಾ ತುಂಬಿದ ದೋಸೆ"],
  "Egg Paratha with Butter":["ಮೊಟ್ಟೆ ಪರೋಟಾ ಬೆಣ್ಣೆಯೊಂದಿಗೆ","ಹೆಚ್ಚು ಬೆಣ್ಣೆಯೊಂದಿಗೆ ಪದರ ಮೊಟ್ಟೆ ಪರೋಟಾ"],
  "Full Mutton Thali":["ಪೂರ್ಣ ಮಟನ್ ಊಟ","ಮಟನ್ ಕರಿ, ಅನ್ನ, ಬೇಳೆ ಮತ್ತು ಇತರ ಪದಾರ್ಥಗಳ ಸಂಪೂರ್ಣ ಊಟ"],
  "Chicken Biryani with Raita":["ಚಿಕನ್ ಬಿರಿಯಾನಿ ರಾಯತ ಜೊತೆ","ತಂಪಾದ ರಾಯತದೊಂದಿಗೆ ಪೂರ್ಣ ಪ್ರಮಾಣದ ಬಿರಿಯಾನಿ"],
  "Mutton Curry with Roti & Rice":["ಮಟನ್ ಕರಿ ರೊಟ್ಟಿ ಮತ್ತು ಅನ್ನ","ರೊಟ್ಟಿ ಮತ್ತು ಅನ್ನ ಎರಡರೊಂದಿಗೆ ಶ್ರೀಮಂತ ಮಟನ್ ಗ್ರೇವಿ"],
  "Prawn Biryani":["ಸಿಗಡಿ ಬಿರಿಯಾನಿ","ಕರಾವಳಿ ಕರ್ನಾಟಕ ಶೈಲಿಯ ಸಿಗಡಿ ಬಿರಿಯಾನಿ"],
  "Chicken Sandwich":["ಚಿಕನ್ ಸ್ಯಾಂಡ್‌ವಿಚ್","ಕರ್ನಾಟಕ ಮಸಾಲೆಯೊಂದಿಗೆ ಚಿಕನ್ ಮೇಯೊ ಸ್ಯಾಂಡ್‌ವಿಚ್"],
  "Mutton Cutlet":["ಮಟನ್ ಕಟ್ಲೆಟ್","ಮಸಾಲೆ ಮಟನ್ ಪ್ಯಾಟಿ"],
};

const conditions = [
  { key:"diabetes",     label:"Diabetes",           label_kn:"ಮಧುಮೇಹ",
    avoid:["sugar","white rice","maida","fried","sweet","jaggery","payasa","kesari"],
    prefer:["ragi","jowar","brown rice","bitter gourd","methi","low glycemic"],
    tip:"Prefer Ragi Mudde and Jolada Roti over white rice. Avoid sweet dishes like Payasa and Kesari Bath.",
    tip_kn:"ಬಿಳಿ ಅನ್ನಕ್ಕಿಂತ ರಾಗಿ ಮುದ್ದೆ ಮತ್ತು ಜೋಳದ ರೊಟ್ಟಿ ಆರಿಸಿ. ಪಾಯಸ, ಕೇಸರಿ ಬಾತ್‌ನಂತಹ ಸಿಹಿ ತಿಂಡಿಗಳನ್ನು ತಪ್ಪಿಸಿ.",
    warning:["Rava Kesari Bath","Puri with Saagu","Groundnut Chikki","Banana Chips with Jaggery","Mango Lassi"] },
  { key:"hypertension", label:"Hypertension (BP)",  label_kn:"ಅಧಿಕ ರಕ್ತದೊತ್ತಡ",
    avoid:["salt","pickle","papad","fried","sodium"],
    prefer:["banana","coconut water","greens","low sodium"],
    tip:"Avoid pickles, papads and excess salt. Include tender coconut water and leafy greens.",
    tip_kn:"ಉಪ್ಪಿನಕಾಯಿ, ಹಪ್ಪಳ ಮತ್ತು ಹೆಚ್ಚು ಉಪ್ಪನ್ನು ತಪ್ಪಿಸಿ. ಎಳನೀರು ಮತ್ತು ಸೊಪ್ಪು ತರಕಾರಿಗಳನ್ನು ಸೇರಿಸಿ.",
    warning:["Karnataka Thali","Fish Fry (2 pieces)","Chicken 65"] },
  { key:"cholesterol",  label:"High Cholesterol",   label_kn:"ಅಧಿಕ ಕೊಲೆಸ್ಟ್ರಾಲ್",
    avoid:["ghee","coconut oil","fried","full fat","butter"],
    prefer:["ragi","oats","vegetables","steamed","grilled"],
    tip:"Avoid excess ghee and fried foods. Opt for steamed or grilled preparations.",
    tip_kn:"ಹೆಚ್ಚು ತುಪ್ಪ ಮತ್ತು ಕರಿದ ಪದಾರ್ಥಗಳನ್ನು ತಪ್ಪಿಸಿ. ಹಬೆಯಲ್ಲಿ ಬೇಯಿಸಿದ ಅಥವಾ ಗ್ರಿಲ್ ಮಾಡಿದ ಖಾದ್ಯಗಳನ್ನು ಆರಿಸಿ.",
    warning:["Puri with Saagu","Masala Dosa with Extra Ghee","Full Karnataka Thali with Payasa"] },
  { key:"thyroid",      label:"Thyroid",            label_kn:"ಥೈರಾಯ್ಡ್",
    avoid:["raw cabbage","soy","processed"],
    prefer:["iodine rich","selenium rich","fish","eggs","whole grains"],
    tip:"Include selenium-rich foods. Fish and eggs are great for thyroid health.",
    tip_kn:"ಸೆಲೆನಿಯಂ ಭರಿತ ಆಹಾರ ಸೇರಿಸಿ. ಮೀನು ಮತ್ತು ಮೊಟ್ಟೆ ಥೈರಾಯ್ಡ್ ಆರೋಗ್ಯಕ್ಕೆ ಉತ್ತಮ.",
    warning:[] },
  { key:"pcod",         label:"PCOD/PCOS",          label_kn:"ಪಿಸಿಒಡಿ / ಪಿಸಿಒಎಸ್",
    avoid:["sugar","refined carbs","fried","processed"],
    prefer:["ragi","whole grains","protein rich","low glycemic","anti-inflammatory"],
    tip:"Focus on low-GI Karnataka grains like Ragi. Avoid sugary and fried foods.",
    tip_kn:"ರಾಗಿಯಂತಹ ಕಡಿಮೆ ಗ್ಲೈಸೆಮಿಕ್ ಧಾನ್ಯಗಳ ಮೇಲೆ ಗಮನ ಹರಿಸಿ. ಸಿಹಿ ಮತ್ತು ಕರಿದ ಆಹಾರ ತಪ್ಪಿಸಿ.",
    warning:["Rava Kesari Bath","Puri with Saagu","Banana Chips with Jaggery"] },
  { key:"anemia",       label:"Anemia",             label_kn:"ರಕ್ತಹೀನತೆ",
    avoid:["tea with meals","coffee with meals"],
    prefer:["iron rich","ragi","spinach","horse gram","jaggery","dates","vitamin C"],
    tip:"Ragi is an excellent iron source — a Karnataka superfood for anemia.",
    tip_kn:"ರಾಗಿ ಕಬ್ಬಿಣದ ಅತ್ಯುತ್ತಮ ಮೂಲ — ರಕ್ತಹೀನತೆಗೆ ಕರ್ನಾಟಕದ ಸೂಪರ್‌ಫುಡ್.",
    warning:[] },
  { key:"kidney",       label:"Kidney Issues",      label_kn:"ಮೂತ್ರಪಿಂಡ ಸಮಸ್ಯೆ",
    avoid:["high potassium","high phosphorus","high protein","salt","processed"],
    prefer:["low potassium","low protein","steamed","boiled"],
    tip:"Limit protein intake and avoid high-potassium foods. Consult your doctor.",
    tip_kn:"ಪ್ರೋಟೀನ್ ಪ್ರಮಾಣ ಮಿತಿಗೊಳಿಸಿ ಮತ್ತು ಹೆಚ್ಚು ಪೊಟ್ಯಾಸಿಯಮ್ ಆಹಾರ ತಪ್ಪಿಸಿ. ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    warning:["Full Mutton Thali","Chicken Biryani Karnataka Style","Prawn Biryani"] },
  { key:"lactose",      label:"Lactose Intolerance",label_kn:"ಲ್ಯಾಕ್ಟೋಸ್ ಅಸಹಿಷ್ಣುತೆ",
    avoid:["milk","paneer","butter","ghee","curd","raita","lassi","payasa"],
    prefer:["coconut milk","plant based","dairy free"],
    tip:"Replace dairy with coconut milk in Karnataka curries.",
    tip_kn:"ಕರ್ನಾಟಕದ ಸಾರು ಪದಾರ್ಥಗಳಲ್ಲಿ ಹಾಲಿನ ಬದಲಿಗೆ ತೆಂಗಿನ ಹಾಲು ಬಳಸಿ.",
    warning:["Mosaru Bajji","Mango Lassi","Roti with Paneer Curry","Rava Kesari Bath"] },
  { key:"gluten",       label:"Gluten Intolerance", label_kn:"ಗ್ಲುಟನ್ ಅಸಹಿಷ್ಣುತೆ",
    avoid:["wheat","roti","maida","semolina","rava"],
    prefer:["rice","ragi","jowar","akki roti","rice based"],
    tip:"Karnataka is naturally gluten-friendly! Stick to Akki Roti, Ragi Mudde, Dosa.",
    tip_kn:"ಕರ್ನಾಟಕದ ಆಹಾರ ಸ್ವಾಭಾವಿಕವಾಗಿ ಗ್ಲುಟನ್ ಸ್ನೇಹಿ! ಅಕ್ಕಿ ರೊಟ್ಟಿ, ರಾಗಿ ಮುದ್ದೆ, ದೋಸೆ ಆರಿಸಿ.",
    warning:["Rava Idli with Chutney","Roti with Enne Badnekai","Rava Kesari Bath"] },
  { key:"none",         label:"No Conditions",      label_kn:"ಯಾವುದೂ ಇಲ್ಲ",
    avoid:[], prefer:[],
    tip:"You have no dietary restrictions. Enjoy the full range of Karnataka cuisine!",
    tip_kn:"ನಿಮಗೆ ಯಾವುದೇ ಆಹಾರ ನಿರ್ಬಂಧಗಳಿಲ್ಲ. ಕರ್ನಾಟಕದ ಸಂಪೂರ್ಣ ಆಹಾರ ವೈವಿಧ್ಯವನ್ನು ಆನಂದಿಸಿ!",
    warning:[] },
];

// Flatten plans -> rows
function flattenMeals() {
  const rows = [];
  for (const [diet, goals] of Object.entries(plans))
    for (const [goal, types] of Object.entries(goals))
      for (const [mealType, list] of Object.entries(types))
        for (const m of list) {
          const kn = KN[m.name] || [null, null];
          rows.push({
            diet_type: diet, goal, meal_type: mealType,
            name: m.name, name_kn: kn[0], description: m.description, description_kn: kn[1],
            calories: m.calories, tags: m.tags.join(","),
          });
        }
  return rows;
}

module.exports = { flattenMeals, conditions, KN };
