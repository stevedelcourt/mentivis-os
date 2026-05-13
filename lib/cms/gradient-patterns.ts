export interface GradientPattern {
  id: number;
  name: string;
  css: string;
}

export const GRADIENT_PATTERNS: GradientPattern[] = [
  {
    id: 5,
    name: "Flows",
    css: `radial-gradient(ellipse 18% 55% at -2% 8%, rgba(115,22,182,.88) 0%, transparent 52%),
radial-gradient(ellipse 15% 35% at 0% 72%, rgba(18,135,78,.78) 0%, transparent 48%),
radial-gradient(ellipse 22% 25% at 5% 40%, rgba(18,88,185,.5) 0%, transparent 45%),
radial-gradient(ellipse 72% 62% at 58% 42%, rgba(238,112,28,.92) 0%, transparent 62%),
radial-gradient(ellipse 52% 55% at 78% 72%, rgba(205,55,38,.88) 0%, transparent 56%),
radial-gradient(ellipse 42% 35% at 85% 18%, rgba(225,158,18,.72) 0%, transparent 52%),
linear-gradient(138deg, #cf6228 0%, #c03228 100%)`,
  },
  {
    id: 6,
    name: "Music",
    css: `radial-gradient(ellipse 55% 52% at 12% 18%, rgba(115,18,175,.88) 0%, transparent 58%),
radial-gradient(ellipse 52% 56% at 78% 52%, rgba(232,48,108,.9) 0%, transparent 56%),
radial-gradient(ellipse 46% 42% at 52% 92%, rgba(222,88,58,.78) 0%, transparent 52%),
radial-gradient(ellipse 28% 28% at 92% 8%, rgba(85,15,142,.62) 0%, transparent 48%),
radial-gradient(ellipse 30% 30% at 8% 88%, rgba(95,12,138,.55) 0%, transparent 46%),
linear-gradient(138deg, #6e12b2 0%, #c23272 100%)`,
  },
  {
    id: 7,
    name: "ImgVid",
    css: `radial-gradient(ellipse 58% 52% at 88% 18%, rgba(38,52,218,.92) 0%, transparent 58%),
radial-gradient(ellipse 55% 58% at 38% 62%, rgba(118,38,202,.88) 0%, transparent 56%),
radial-gradient(ellipse 46% 42% at 12% 88%, rgba(202,48,152,.78) 0%, transparent 52%),
radial-gradient(ellipse 35% 30% at 65% 85%, rgba(148,28,178,.55) 0%, transparent 48%),
linear-gradient(138deg, #2232b8 0%, #6e1e9e 100%)`,
  },
  {
    id: 12,
    name: "Acid",
    css: `radial-gradient(ellipse 55% 52% at 16% 26%, rgba(145,228,0,.9) 0%, transparent 56%),
radial-gradient(ellipse 52% 48% at 82% 60%, rgba(255,200,0,.88) 0%, transparent 54%),
radial-gradient(ellipse 46% 44% at 52% 90%, rgba(255,115,0,.75) 0%, transparent 52%),
radial-gradient(ellipse 35% 30% at 86% 16%, rgba(202,242,0,.62) 0%, transparent 48%),
radial-gradient(ellipse 28% 25% at 8% 75%, rgba(80,200,0,.5) 0%, transparent 46%),
linear-gradient(138deg, #70be00 0%, #e89600 100%)`,
  },
];
