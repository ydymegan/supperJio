const North = [
    { value: '25', label: "Woodlands, Admiralty" },
    { value: '27', label: "Sembawang, Yishun, Admiralty" },
    { value: '26', label: "Upper Thomson, Mandai" },
    { value: '28', label: "Yio Chu Kang, Seletar" }
]

const South = [
    { value: '2', label: "Tanjong Pagar, Chinatown" },
    { value: '4', label: "Mount Faber, Telok Blangah, Harbourfront" },
    { value: '3', label: "Tiong Bahru, Alexandra, Queenstown" },
    { value: '6', label: "Clarke Quay, City Hall" },
    { value: '1', label: "Raffles Place, Marina, Cecil" },
    { value: '7', label: "Bugis, Beach Road, Golden Mile" }
]
const East = [
    { value: '17', label: "Changi, Flora, Loyang" },
    { value: '16', label: "Bedok, Upper East Coast, Siglap" },
    { value: '18', label: "Tampines, Pasir Ris" },
    { value: '15', label: "Joo Chiat, Marina Parade, Katong" },
    { value: '14', label: "Geylang, Paya Lebar, Sims" },
    { value: '19', label: "Punggol, Sengkang, Serangoon Gardens" }
]

const West = [
    { value: '22', label: "Boon Lay, Jurong, Tuas" },
    { value: '24', label: "Kranji, Lim Chu Kang, Tengah" },
    { value: '5', label: "Buona Vista, Pasir Panjang, Clementi" },
    { value: '21', label: "Upper Bukit Timah, Ulu Pandan, Clementi Park" },
    { value: '23', label: "Choa Chu Kang, Diary Farm, Hillview, Bukit Panjang, Bukit Batok" }
]

const Central = [
    { value: '11', label: "Novena, Newton, Thomson" },
    { value: '20', label: "Ang Mo Kio, Bishan, Thomson" },
    { value: '12', label: "Toa Payoh, Serangoon, Balestier" },
    { value: '13', label: "Macpherson, Braddell" },
    { value: '8', label: "Little India, Farrer Park" },
    { value: '9', label: "Orchard Road, River Valley" },
    { value: '10', label: "Bukit Timah, Holland, Balmoral" }
]

export const groupedOptions = [
    { label: "", options: "" },
    { label: "North", options: North },
    { label: "South", options: South },
    { label: "East", options: East },
    { label: "West", options: West },
    { label: "Central", options: Central },
]