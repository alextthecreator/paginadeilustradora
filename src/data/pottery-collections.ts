import { cloudinaryImages } from './cloudinary-images';

export type PotteryCollectionId =
  | 'brzoskwinia'
  | 'brzoza'
  | 'costa-rica'
  | 'forest-wildlife'
  | 'koke-hikari'
  | 'yu-koke';

export interface PotteryImage {
  src: string;
  alt: string;
}

export interface PotteryCollection {
  id: PotteryCollectionId;
  name: string;
  images: PotteryImage[];
}

/** Dodaj / podmień zdjęcia w każdej kolekcji (Cloudinary URL). */
export const potteryCollections: PotteryCollection[] = [
  {
    id: 'brzoskwinia',
    name: 'BRZOSKWINIA',
    images: [
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1768904132/BRZOSKWINIA_COLLECTION_05_i7rzf1.jpg", alt: 'BRZOSKWINIA — piece 5' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1768904130/BRZOSKWINIA_COLLECTION_04_y0vxkt.jpg", alt: 'BRZOSKWINIA — piece 4' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1768904128/BRZOSKWINIA_COLLECTION_03_gansca.jpg", alt: 'BRZOSKWINIA — piece 3' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1768904126/BRZOSKWINIA_COLLECTION_02_pq8qtv.jpg", alt: 'BRZOSKWINIA — piece 2' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1768904125/BRZOSKWINIA_COLLECTION_01_kfumsi.jpg", alt: 'BRZOSKWINIA — piece 1' },
    ],
  },
  {
    id: 'brzoza',
    name: 'BRZOZA',
    images: [
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1768904123/BRZOZA_COLLECTION_07_iocyp0.jpg", alt: 'BRZOZA — piece 7' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1768904121/BRZOZA_COLLECTION_06_ig1zft.jpg", alt: 'BRZOZA — piece 6' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1768904119/BRZOZA_COLLECTION_05_djcjwa.jpg", alt: 'BRZOZA — piece 5' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1768904117/BRZOZA_COLLECTION_04_bq0wzn.jpg", alt: 'BRZOZA — piece 4' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1768904116/BRZOZA_COLLECTION_03_uvixns.jpg", alt: 'BRZOZA — piece 3' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1768904114/BRZOZA_COLLECTION_02_ruqwds.jpg", alt: 'BRZOZA — piece 2' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1768904112/BRZOZA_COLLECTION_01_cvjv5g.jpg", alt: 'BRZOZA — piece 1' },
    ],
  },
  {
    id: 'costa-rica',
    name: 'COSTA RICA',
    images: [
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1768904139/COSTA_RICA_COLLECTION_TUCAN_j9fyrf.jpg", alt: 'COSTA RICA — piece 1' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1768904138/COSTA_RICA_COLLECTION_PEREZOSO_uvlbsm.jpg", alt: 'COSTA RICA — piece 2' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1768904136/COSTA_RICA_COLLECTION_DANTA_bfwprt.jpg", alt: 'COSTA RICA — piece 3' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1768904134/COSTA_RICA_COLLECTION_COLIBRI_wdczny.jpg", alt: 'COSTA RICA — piece 4' },
    ],
  },
  {
    id: 'forest-wildlife',
    name: 'FOREST WILDLIFE',
    images: [
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1768904149/FOREST_WILDLIFE_COLLECTION_05_iose6v.jpg", alt: 'FOREST WILDLIFE — piece 5' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1768904147/FOREST_WILDLIFE_COLLECTION_04_kq9nto.jpg", alt: 'FOREST WILDLIFE — piece 4' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1768904145/FOREST_WILDLIFE_COLLECTION_03_yynwde.jpg", alt: 'FOREST WILDLIFE — piece 3' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1768904144/FOREST_WILDLIFE_COLLECTION_02_zj2d6m.jpg", alt: 'FOREST WILDLIFE — piece 2' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1768904142/FOREST_WILDLIFE_COLLECTION_01_hgpo3d.jpg", alt: 'FOREST WILDLIFE — piece 1' },
    ],
  },
  {
    id: 'koke-hikari',
    name: 'KOKE-HIKARI',
    images: [
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1783617816/KOKE-HIKARI-04_yciiln.jpg", alt: 'KOKE-HIKARI — piece 4' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1783617816/KOKE-HIKARI-02_wdfnlj.jpg", alt: 'KOKE-HIKARI — piece 3' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1783617816/KOKE-HIKARI-03_dvv2gc.jpg", alt: 'KOKE-HIKARI — piece 2' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1783617815/KOKE-HIKARI-01_i2dsbl.jpg", alt: 'KOKE-HIKARI — piece 1' },
    ],
  },
  {
    id: 'yu-koke',
    name: 'YŪ-KOKE',
    images: [
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1783617838/YU%CC%84-KOKE-05_at4hsn.jpg", alt: 'YU-KOKE — piece 5' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1783617837/YU%CC%84-KOKE-04_mpkukc.jpg", alt: 'YU-KOKE — piece 4' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1783617837/YU%CC%84-KOKE-03_pegtbj.jpg", alt: 'YU-KOKE — piece 3' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1783617837/YU%CC%84-KOKE-02_nks6dt.jpg", alt: 'YU-KOKE — piece 2' },
      { src: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1783617836/YU%CC%84-KOKE-01_sb6bnw.jpg", alt: 'YU-KOKE — piece 1' },
    ],
  },
];