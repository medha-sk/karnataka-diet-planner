import { useEffect, useState } from "react";
import axios from "axios";

let cache = null;
// Fetches the medical-condition catalogue once (labels + tips in English & Kannada)
export default function useConditions() {
  const [list, setList] = useState(cache || []);
  useEffect(() => {
    if (cache) return;
    axios.get("/api/public/conditions").then(r => { cache = r.data; setList(r.data); }).catch(() => {});
  }, []);
  return list;
}
