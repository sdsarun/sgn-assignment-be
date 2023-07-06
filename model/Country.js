import { Schema, model } from "mongoose";

const countrySchema = Schema({
  name: { type: String },
  cases: { type: Map }
});

export const Country = model('Country', countrySchema);
