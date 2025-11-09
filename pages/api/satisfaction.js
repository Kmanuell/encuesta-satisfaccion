// pages/api/satisfaction.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Mapea las etiquetas que envía el frontend a un número:
 * "Insatisfecho" -> 1
 * "Neutral"      -> 3
 * "Satisfecho"   -> 5
 */
function mapLabelToNumber(label) {
  if (!label || typeof label !== "string") return null;
  const normalized = label.trim().toLowerCase();
  if (normalized === "insatisfecho") return 1;
  if (normalized === "neutral") return 3;
  if (normalized === "satisfecho") return 5;
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { value } = req.body;

    // Aceptamos números o etiquetas (strings)
    let numericValue = null;
    if (typeof value === "number") {
      numericValue = value;
    } else if (typeof value === "string") {
      numericValue = mapLabelToNumber(value);
    }

    if (typeof numericValue !== "number" || Number.isNaN(numericValue)) {
      return res
        .status(400)
        .json({ error: "value must be a number or a valid label" });
    }

    const ahora = new Date();
    const fecha = ahora.toISOString().split("T")[0]; // YYYY-MM-DD
    const hora = ahora.toLocaleTimeString("es-CL", { hour12: false });

    const { error } = await supabase
      .from("satisfaccion_clientes")
      .insert([{ valor: numericValue, fecha, hora }]);

    if (error) {
      console.error("Supabase error", error);
      return res.status(500).json({ error: error.message || "DB error" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Server error", err);
    return res.status(500).json({ error: err.message || "server error" });
  }
}
