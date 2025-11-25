export const CATEGORIES = [
  'mon_nuong',
  'mon_lau',
  'khai_vi',
  'do_uong',
  'trang_mieng',
  'an_kem',
  'theo_mua',
  'khac',
] as const

export const mapLabelCategory: Record<(typeof CATEGORIES)[number], string> = {
  mon_nuong: 'Đồ nướng',
  mon_lau: 'Đồ nhúng lẩu',
  khai_vi: 'Khai vị',
  do_uong: 'Đồ uống',
  trang_mieng: 'Tráng miệng',
  an_kem: 'Ăn kèm',
  theo_mua: 'Theo mùa',
  khac: 'Khác',
}
