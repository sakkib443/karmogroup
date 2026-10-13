/**
 * Bangladesh's 8 divisions and 64 districts, for filtering orders by where they go.
 *
 * Addresses are typed by customers, so each district carries every way it is commonly
 * written — the official name, the Bangla name, the old spelling (Chittagong, Comilla,
 * Jessore…) and, for the big cities, the areas people write instead of the district.
 */

export interface District { key: string; name: string; bn: string; aliases?: string[] }
export interface Division { key: string; name: string; bn: string; districts: District[] }

const d = (name: string, bn: string, aliases: string[] = []): District => ({
    key: name.toLowerCase().replace(/[^a-z]/g, ''),
    name,
    bn,
    aliases,
});

export const BD_DIVISIONS: Division[] = [
    {
        key: 'barishal', name: 'Barishal', bn: 'বরিশাল', districts: [
            d('Barguna', 'বরগুনা'),
            d('Barishal', 'বরিশাল', ['Barisal']),
            d('Bhola', 'ভোলা'),
            d('Jhalokathi', 'ঝালকাঠি', ['Jhalokati', 'Jhalakathi']),
            d('Patuakhali', 'পটুয়াখালী'),
            d('Pirojpur', 'পিরোজপুর'),
        ],
    },
    {
        key: 'chattogram', name: 'Chattogram', bn: 'চট্টগ্রাম', districts: [
            d('Bandarban', 'বান্দরবান'),
            d('Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', ['B. Baria', 'B Baria']),
            d('Chandpur', 'চাঁদপুর'),
            d('Chattogram', 'চট্টগ্রাম', ['Chittagong', 'Ctg', 'Agrabad', 'Halishahar', 'Pahartali', 'Patenga']),
            d("Cox's Bazar", 'কক্সবাজার', ['Coxs Bazar', 'Cox Bazar']),
            d('Cumilla', 'কুমিল্লা', ['Comilla']),
            d('Feni', 'ফেনী'),
            d('Khagrachhari', 'খাগড়াছড়ি', ['Khagrachari']),
            d('Lakshmipur', 'লক্ষ্মীপুর', ['Laxmipur', 'Lakshipur']),
            d('Noakhali', 'নোয়াখালী'),
            d('Rangamati', 'রাঙ্গামাটি', ['রাঙামাটি']),
        ],
    },
    {
        key: 'dhaka', name: 'Dhaka', bn: 'ঢাকা', districts: [
            d('Dhaka', 'ঢাকা', [
                'Mirpur', 'মিরপুর', 'Uttara', 'উত্তরা', 'Dhanmondi', 'ধানমন্ডি', 'Gulshan', 'গুলশান', 'Banani', 'Mohammadpur',
                'Badda', 'Rampura', 'Khilgaon', 'Motijheel', 'Tejgaon', 'Farmgate', 'Jatrabari', 'Keraniganj', 'Savar', 'সাভার',
                'Bashundhara', 'Malibagh', 'Mohakhali', 'Shyamoli', 'Lalbagh', 'Wari', 'Pallabi', 'Khilkhet', 'Dohar',
            ]),
            d('Faridpur', 'ফরিদপুর'),
            d('Gazipur', 'গাজীপুর', ['Tongi', 'টঙ্গী']),
            d('Gopalganj', 'গোপালগঞ্জ'),
            d('Kishoreganj', 'কিশোরগঞ্জ'),
            d('Madaripur', 'মাদারীপুর'),
            d('Manikganj', 'মানিকগঞ্জ'),
            d('Munshiganj', 'মুন্সীগঞ্জ', ['মুন্সিগঞ্জ']),
            d('Narayanganj', 'নারায়ণগঞ্জ', ['Fatullah', 'Siddhirganj']),
            d('Narsingdi', 'নরসিংদী'),
            d('Rajbari', 'রাজবাড়ী'),
            d('Shariatpur', 'শরীয়তপুর'),
            d('Tangail', 'টাঙ্গাইল'),
        ],
    },
    {
        key: 'khulna', name: 'Khulna', bn: 'খুলনা', districts: [
            d('Bagerhat', 'বাগেরহাট'),
            d('Chuadanga', 'চুয়াডাঙ্গা'),
            d('Jashore', 'যশোর', ['Jessore']),
            d('Jhenaidah', 'ঝিনাইদহ', ['Jhenaidaha']),
            d('Khulna', 'খুলনা'),
            d('Kushtia', 'কুষ্টিয়া'),
            d('Magura', 'মাগুরা'),
            d('Meherpur', 'মেহেরপুর'),
            d('Narail', 'নড়াইল'),
            d('Satkhira', 'সাতক্ষীরা'),
        ],
    },
    {
        key: 'mymensingh', name: 'Mymensingh', bn: 'ময়মনসিংহ', districts: [
            d('Jamalpur', 'জামালপুর'),
            d('Mymensingh', 'ময়মনসিংহ'),
            d('Netrokona', 'নেত্রকোণা', ['Netrakona', 'নেত্রকোনা']),
            d('Sherpur', 'শেরপুর'),
        ],
    },
    {
        key: 'rajshahi', name: 'Rajshahi', bn: 'রাজশাহী', districts: [
            d('Bogura', 'বগুড়া', ['Bogra']),
            d('Chapainawabganj', 'চাঁপাইনবাবগঞ্জ', ['Chapai Nawabganj', 'Chapai']),
            d('Joypurhat', 'জয়পুরহাট', ['Jaipurhat']),
            d('Naogaon', 'নওগাঁ'),
            d('Natore', 'নাটোর'),
            d('Pabna', 'পাবনা'),
            d('Rajshahi', 'রাজশাহী'),
            d('Sirajganj', 'সিরাজগঞ্জ'),
        ],
    },
    {
        key: 'rangpur', name: 'Rangpur', bn: 'রংপুর', districts: [
            d('Dinajpur', 'দিনাজপুর'),
            d('Gaibandha', 'গাইবান্ধা'),
            d('Kurigram', 'কুড়িগ্রাম'),
            d('Lalmonirhat', 'লালমনিরহাট'),
            d('Nilphamari', 'নীলফামারী'),
            d('Panchagarh', 'পঞ্চগড়'),
            d('Rangpur', 'রংপুর'),
            d('Thakurgaon', 'ঠাকুরগাঁও'),
        ],
    },
    {
        key: 'sylhet', name: 'Sylhet', bn: 'সিলেট', districts: [
            d('Habiganj', 'হবিগঞ্জ'),
            d('Moulvibazar', 'মৌলভীবাজার', ['Moulvi Bazar', 'Maulvibazar']),
            d('Sunamganj', 'সুনামগঞ্জ'),
            d('Sylhet', 'সিলেট'),
        ],
    },
];

/** All 64 districts, A–Z, each knowing its division. */
export const BD_DISTRICTS: (District & { division: string })[] = BD_DIVISIONS
    .flatMap((v) => v.districts.map((x) => ({ ...x, division: v.key })))
    .sort((a, b) => a.name.localeCompare(b.name));

export const getDivision = (key: string) => BD_DIVISIONS.find((v) => v.key === key);
export const getDistrict = (key: string) => BD_DISTRICTS.find((x) => x.key === key);

/** Every way a district is written. */
export const districtTerms = (x: District) => [x.name, x.bn, ...(x.aliases || [])];
/** Every way any district of a division is written. */
export const divisionTerms = (v: Division) => v.districts.flatMap(districtTerms);

const norm = (s: string) => String(s || '').toLowerCase().replace(/\b(division|district|zila|zilla)\b|বিভাগ|জেলা/g, '').replace(/[^a-zঀ-৿]/g, '');

/** "Chittagong", "চট্টগ্রাম", "Ctg" → the Chattogram district. */
export function findDistrict(text: string) {
    const n = norm(text);
    if (!n) return undefined;
    return BD_DISTRICTS.find((x) => districtTerms(x).some((t) => norm(t) === n));
}

/** "Sylhet Division", "সিলেট বিভাগ" → the Sylhet division (only when it says "division"). */
function findDivisionByName(text: string) {
    if (!/division|বিভাগ/i.test(text)) return undefined;
    const n = norm(text);
    return BD_DIVISIONS.find((v) => norm(v.name) === n || norm(v.bn) === n);
}

/**
 * A delivery zone (Shipping → Zones) is a name and the districts it covers. Each
 * region that is a known district or division is widened to all its spellings.
 */
export function zoneTerms(zone: { name?: string; regions?: string[] }): string[] {
    const out = new Set<string>();
    if (zone.name) out.add(zone.name);
    for (const r of zone.regions || []) {
        const div = findDivisionByName(r);
        const dist = div ? undefined : findDistrict(r);
        (div ? divisionTerms(div) : dist ? districtTerms(dist) : [r]).forEach((t) => out.add(t));
    }
    return Array.from(out);
}
