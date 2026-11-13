// モーダルが開いている間、後ろのページをスクロールさせないための関数。
//
// 「body に overflow: hidden を付けるだけ」だと、スクロールバーが消えて、
// ページ全体の幅が(スクロールバーの太さ ≒ 15px)広がり、ページが横にガタッとズレる。
// 閉じるときは逆にスクロールバーが出てきて、もう一度ズレる。
// それを防ぐために、消えたスクロールバーの太さぶんだけ body の右に余白を足して、
// ページの中身の位置が動かないようにしている。
//
// 画面の右端に固定している部品(PageTopButton など)も、同じ分だけズレるので、
// 太さを CSS の変数 --scrollbar-comp に入れておく
// (使い方の例:right: calc(30px + var(--scrollbar-comp, 0px)); )

let isLocked = false;

export function lockScroll(): void {
  if (isLocked) return; // すでにロック中なら何もしない(スクロールバーが消えた後だと、太さが0に見えてしまうため)
  isLocked = true;

  const root = document.documentElement;
  const body = document.body;

  // スクロールバーの太さ。スマホなど「重ねて表示する」タイプのスクロールバーでは0になる
  const scrollbarWidth = window.innerWidth - root.clientWidth;

  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${scrollbarWidth}px`;
    root.style.setProperty("--scrollbar-comp", `${scrollbarWidth}px`);
  }
  body.style.overflow = "hidden";
}

export function unlockScroll(): void {
  isLocked = false;

  const root = document.documentElement;
  const body = document.body;

  // 余白を戻すのと、スクロールバーが戻るのを、同じタイミングで行う(ここがズレるとガタつく)
  body.style.overflow = "";
  body.style.paddingRight = "";
  root.style.removeProperty("--scrollbar-comp");
}
