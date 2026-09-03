import type { Paper, PaperId, Unit } from "./types";
import major1Raw from "./major1-notes.json";
import otherRaw from "./other-notes.json";

const major1Units = major1Raw as Unit[];
const other = otherRaw as Record<"major2" | "major3" | "minor1" | "minor2", Unit[]>;

export const PAPERS: Paper[] = [
  {
    id: "major1",
    kind: "major",
    label: "Major Paper I",
    labelHi: "मेजर पेपर I",
    title: "Fundamentals of Botany",
    titleHi: "बॉटनी के मूल सिद्धांत",
    meta: "B.Sc. I Year · 5 units · theory",
    marks: "University paper",
    units: major1Units,
  },
  {
    id: "major2",
    kind: "major",
    label: "Major Paper II",
    labelHi: "मेजर पेपर II",
    title: "Microbes and Lower Plant Diversity",
    titleHi: "सूक्ष्मजीव एवं निम्न पादप विविधता",
    meta: "B.Sc. I Year · 5 units · theory",
    marks: "University paper",
    units: other.major2,
  },
  {
    id: "major3",
    kind: "major",
    label: "Major Paper III",
    labelHi: "मेजर पेपर III",
    title: "Applied Botany",
    titleHi: "व्यावहारिक बॉटनी",
    meta: "B.Sc. I Year · 5 units · applied + practical",
    marks: "University paper",
    units: other.major3,
  },
  {
    id: "minor1",
    kind: "minor",
    label: "Minor Paper I",
    labelHi: "माइनर पेपर I",
    title: "Elementary Botany",
    titleHi: "प्रारंभिक बॉटनी",
    meta: "B.Sc. I Year · 5 units",
    marks: "University paper",
    units: other.minor1,
  },
  {
    id: "minor2",
    kind: "minor",
    label: "Minor Paper II",
    labelHi: "माइनर पेपर II",
    title: "Diversity of Plants",
    titleHi: "पादप विविधता",
    meta: "B.Sc. I Year · 5 units",
    marks: "University paper",
    units: other.minor2,
  },
];

export function getPaper(id: PaperId) {
  return PAPERS.find((p) => p.id === id);
}

export function getUnit(paperId: PaperId, unitId: string) {
  return getPaper(paperId)?.units.find((u) => u.id === unitId);
}

export const TOTAL_UNITS = PAPERS.reduce((n, p) => n + p.units.length, 0);
