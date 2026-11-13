// バナーの自動配置
//
// 1〜5枚のバナー(縦横比がバラバラ)を、指定した枠(maxW × maxH)の中に
// 「できるだけ大きく」「スクロールなしで」収まるように並べる計算だけを行うファイルです。
// 画面(React)のことは何も知らないので、数字だけでテストできます。
//
// 考え方:
//   バナーを「横に並べる(row)」か「縦に積む(col)」で、2つずつ組み合わせていく。
//   例) 横長 / (縦長 | (横長 / 小さいの))  ← 「縦長を左、残りを右に積む」のような並び
//   順番(データに書いた順)は変えずに、組み合わせ方だけを全パターン試して、
//   いちばん小さいバナーが大きく見える並びを選ぶ。

export type BannerSize = { w: number; h: number }; // 画像の元の大きさ(px)
export type PlacedBanner = { x: number; y: number; w: number; h: number };
export type BannerLayout = {
  width: number; // 並べた全体の幅
  height: number; // 並べた全体の高さ
  items: PlacedBanner[]; // バナーごとの位置と大きさ(入力と同じ順番)
  minSide: number; // いちばん小さいバナーの短い辺(小さくなりすぎの判定に使う)
};

type Node =
  | { kind: "leaf"; i: number }
  | { kind: "row" | "col"; a: Node; b: Node };

// 全パターンを試せるのは、この枚数まで(5枚で224通り。6枚で1344通り)
export const MAX_AUTO_LAYOUT = 6;

// 並び方の候補(枚数ごとに1回だけ作って使い回す)
const treeCache = new Map<number, Node[]>();

function enumerate(lo: number, hi: number): Node[] {
  if (hi - lo === 1) return [{ kind: "leaf", i: lo }];
  const result: Node[] = [];
  for (let k = lo + 1; k < hi; k++) {
    const lefts = enumerate(lo, k);
    const rights = enumerate(k, hi);
    for (const kind of ["row", "col"] as const) {
      for (const a of lefts) for (const b of rights) result.push({ kind, a, b });
    }
  }
  return result;
}

function getTrees(n: number): Node[] {
  let trees = treeCache.get(n);
  if (!trees) {
    trees = enumerate(0, n);
    treeCache.set(n, trees);
  }
  return trees;
}

// 各まとまりは「高さ = a × 幅 + b × gap」という式で表せる(gap は固定の隙間)。
// この a, b を下から順に求めておくと、隙間込みでぴったり収まる大きさが計算できる
type Shape = { a: number; b: number };

function shapeOf(node: Node, ratios: number[]): Shape {
  if (node.kind === "leaf") return { a: 1 / ratios[node.i], b: 0 };
  const sa = shapeOf(node.a, ratios);
  const sb = shapeOf(node.b, ratios);
  if (node.kind === "col") {
    // 縦に積む: 幅は共通、高さは足し算(+ 隙間1つ)
    return { a: sa.a + sb.a, b: sa.b + sb.b + 1 };
  }
  // 横に並べる: 高さは共通、幅は足し算(+ 隙間1つ)
  const inv = 1 / sa.a + 1 / sb.a;
  return { a: 1 / inv, b: (sa.b / sa.a + sb.b / sb.a - 1) / inv };
}

function place(
  node: Node,
  ratios: number[],
  gap: number,
  x: number,
  y: number,
  w: number,
  h: number,
  out: PlacedBanner[]
): boolean {
  if (!(w > 0) || !(h > 0)) return false;
  if (node.kind === "leaf") {
    out[node.i] = { x, y, w, h };
    return true;
  }
  const sa = shapeOf(node.a, ratios);
  const sb = shapeOf(node.b, ratios);
  if (node.kind === "col") {
    const ha = sa.a * w + sa.b * gap;
    const hb = sb.a * w + sb.b * gap;
    return (
      place(node.a, ratios, gap, x, y, w, ha, out) &&
      place(node.b, ratios, gap, x, y + ha + gap, w, hb, out)
    );
  }
  const wa = (h - sa.b * gap) / sa.a;
  const wb = (h - sb.b * gap) / sb.a;
  return (
    place(node.a, ratios, gap, x, y, wa, h, out) &&
    place(node.b, ratios, gap, x + wa + gap, y, wb, h, out)
  );
}

// 1つの並び方を、枠(maxW × maxH)に収めて配置する。
// 元の画像より大きくならないように、必要なら全体を縮める
function fitTree(
  tree: Node,
  sizes: BannerSize[],
  ratios: number[],
  maxW: number,
  maxH: number,
  gap: number
): { width: number; height: number; items: PlacedBanner[] } | null {
  const root = shapeOf(tree, ratios);

  // 枠に収まる最大の大きさ(幅いっぱい → 高さが足りなければ、高さいっぱい)
  let width = maxW;
  let height = root.a * width + root.b * gap;
  if (height > maxH) {
    height = maxH;
    width = (height - root.b * gap) / root.a;
  }

  let items: PlacedBanner[] = [];
  for (let step = 0; step < 8; step++) {
    items = [];
    if (!place(tree, ratios, gap, 0, 0, width, height, items)) return null;

    // 元の画像より大きく表示されるバナーがあれば、全体を同じ割合で縮める
    let c = 1;
    items.forEach((it, i) => {
      c = Math.min(c, sizes[i].w / it.w);
    });
    if (c >= 0.9995) break;
    width *= c;
    height = root.a * width + root.b * gap;
  }

  if (!(width > 0) || !(height > 0)) return null;
  return { width, height, items };
}

export function layoutBanners(
  sizes: BannerSize[],
  maxW: number,
  maxH: number,
  gap: number
): BannerLayout | null {
  const n = sizes.length;
  if (n === 0 || n > MAX_AUTO_LAYOUT) return null;
  if (!(maxW > 0) || !(maxH > 0)) return null;

  const ratios = sizes.map((s) => s.w / s.h);
  let best: { width: number; height: number; items: PlacedBanner[] } | null =
    null;
  let bestMin = -1;
  let bestTotal = -1;

  for (const tree of getTrees(n)) {
    const fit = fitTree(tree, sizes, ratios, maxW, maxH, gap);
    if (!fit) continue;
    const areas = fit.items.map((it) => it.w * it.h);
    const min = Math.min(...areas);
    const total = areas.reduce((s, v) => s + v, 0);
    // いちばん小さいバナーが大きい並びを優先。同じくらいなら、全体の面積が大きい方
    if (min > bestMin + 1e-6 || (Math.abs(min - bestMin) <= 1e-6 && total > bestTotal)) {
      best = fit;
      bestMin = min;
      bestTotal = total;
    }
  }
  if (!best) return null;

  // 小数のままだと画像がにじむので、整数にそろえる
  const items = best.items.map((it) => ({
    x: Math.round(it.x),
    y: Math.round(it.y),
    w: Math.round(it.w),
    h: Math.round(it.h),
  }));
  return {
    width: Math.round(best.width),
    height: Math.round(best.height),
    items,
    minSide: Math.min(...items.map((it) => Math.min(it.w, it.h))),
  };
}
