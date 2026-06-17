import { redirect } from "next/navigation";

// 入口はLP一本。ルート(/)はマーケLP(/lp)へ送り、LPのCTA→/game でゲーム開始。
export default function RootPage() {
  redirect("/lp");
}
