export interface LocationItem {
  id: string;
  name: string;
  nameEn: string;
  district: string;
  description: string;
}

export const LOCATIONS: LocationItem[] = [
  {
    id: 'hatyai-central',
    name: 'หาดใหญ่',
    nameEn: 'Hat Yai',
    district: 'หาดใหญ่',
    description: 'ศูนย์กลางเศรษฐกิจ การค้า การศึกษา และการเดินทางของพื้นที่ตอนล่าง',
  },
  {
    id: 'mueang-songkhla',
    name: 'เมืองสงขลา',
    nameEn: 'Mueang Songkhla',
    district: 'เมืองสงขลา',
    description: 'โซนเมืองเก่า ชายทะเล สถานที่ราชการ และย่านอยู่อาศัยของเมืองสงขลา',
  },
  {
    id: 'khuan-lang',
    name: 'ควนลัง',
    nameEn: 'Khuan Lang',
    district: 'ควนลัง',
    description: 'ทำเลฝั่งสนามบินหาดใหญ่ เชื่อมต่อถนนสายหลักและพื้นที่อยู่อาศัย',
  },
  {
    id: 'khlong-hae',
    name: 'คลองแห',
    nameEn: 'Khlong Hae',
    district: 'คลองแห',
    description: 'พื้นที่ชุมชนฝั่งเหนือของหาดใหญ่ เชื่อมต่อถนนลพบุรีราเมศวร์',
  },
  {
    id: 'ban-phru',
    name: 'บ้านพรุ',
    nameEn: 'Ban Phru',
    district: 'บ้านพรุ',
    description: 'โซนอยู่อาศัยทางใต้ของหาดใหญ่ เดินทางเชื่อมตัวเมืองและเส้นทางหลักได้สะดวก',
  },
  {
    id: 'thung-lung',
    name: 'ทุ่งลุง',
    nameEn: 'Thung Lung',
    district: 'ทุ่งลุง',
    description: 'พื้นที่ตามแนวถนนกาญจนวนิช เหมาะกับการค้นหาบ้าน ที่ดิน และทรัพย์เชิงพาณิชย์',
  },
];

export const DISTRICTS_LIST = [
  'หาดใหญ่',
  'เมืองสงขลา',
  'ควนลัง',
  'คลองแห',
  'บ้านพรุ',
  'ทุ่งลุง',
  'คอหงส์',
  'สิงหนคร',
];
