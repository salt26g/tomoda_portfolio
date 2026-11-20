import { Worksdata } from "@/data/works_data";

export function findWorkGenre(url: string): string | undefined {
  return Worksdata.find((work) => work.url === url)?.genres[0];
}
