# Bilietų pirkimo ir pardavimo platforma naudojant 
Tai projektas įgyvendinantis decantralizuotą ir saugų bilietų pirkimą bei pardavimą Ethereum tinkle. Aplikacija (DApp) naudoja išmaniasias sutartis (angl. _smart contracts_ ) parašytas Solidity kalba renginių bilietų pirkimui ir pardavimui.

# Poreikis
Programos poreikis implementuojant saugų bilietų pirkimą matomas esant situacijos, kai pinigai sumokami, tačiau pirkėjas negauna žadėto bilieto ir lieka apgautas. Mūsų sukurta programa implementuoja išmaniasias sutartis taip įgalindama saugų pirkimo būdą.

Patvirtintų partnerių (tokių kaip pavyzdžiui _bilietai.lt_ ar _Ticketmaster_ plačiai naudojamo visame pasaulyje) jau nupirkti bilietai (t.y turimas NFT) parduodamas mūsų programoje – NFT galima keisti į pinigus (ETH) išmaniosios sutarties pagalba.

NFT pridedamas į Blockchain tinklą – pirkėjas saugiai nusiperka bilietą, o pardavėjas gauna kriptovaliutos pinigus taip neapgaunant nė vienos šalies ir užtikrinant skaidrų bilietų pirkimą.

# Darbo tikslas 
- Įgyvendinti išmaniasias sutartis su Solidity
- Sukurti decantralizuotą aplikaciją
- Sukurti naudotojo sąsają aplikacijai naudojant _react.js_
- Užtikrinti saugius ir nepriklausomus sandorius tarp šalių

# Verslo modelis ir logika

## Dalyviai
### 1. Pardavėjas
  * Gauna mokėjimą ETH
  * Skelbimo valdymas (gali atšaukti skelbimą bet kuriuo metu prieš parduodant bilietą)
  * Kainos nustatymas
  * Bilietų skelbimas
      
### 2. Pirkėjas
  * Bilietų pirkimas
  * Mokėjimas
  * NFT gavimas
  * Nuosavybė – blockchain įrašas patvirtina bilieto nuosavybę
      
### 3. Renginio organizatorius
   * Renginio organizatorius yra pirminis bilietų tiekėjas ir sistemos iniciatorius
   * Sutarčių kūrimas
   * Metaduomenų valdymas
   * Pirminis pardavimas (mintina bilietus kaip NFT ir parduoda juos pirkėjams)
   * Lėšų surinkimas (gauna procentinę dalį nuo bilietų pirkimo ir pardavimo)

## Verslo scenarijus

Bilieto Savininkas → Skelbia bilietą Prekyvietėje → Patvirtina prekyvietę → Pirkėjas perka → Pervedimas + Mokėjimas → Naujas savininkas gauna bilietą

1. Bilieto savininkas turi NFT savo piniginėje
2. Patvirtinama sutartis (_approve()_)
3. Bilieto savininkas skelbia bilietą pardavimui su savo nustatyta kaina
4. Antrinis pirkėjas naršo aplikacijoje bei randa norimą renginio bilietą
5. Antrinis pirkėjas perka bilietą sumokėdamas nurodytą ETH kainą
6. Pirkėjas gauna NFT
7. Pardavėjas gauna ETH mokėjimą
8. Antrinis pirkėjas tampa nauju bilieto savininku

## Sekų diagrama (angl. _sequence flow_)
Diagrama vaizduoja sąveiką tarp vartotojo sąsajos, kontrakto ir Blockchain tinklo.
<img width="5370" height="5510" alt="Ticket Resale Smart-2025-12-17-222946" src="https://github.com/user-attachments/assets/cbf472cd-1cf9-4d0e-9eb8-ea9505c8c48d" />

# Testavimas

## Viešasis tinklas | Sepolia

## Privatus tinklas | Genache

# Naudotojo sąsaja (angl. _front-end_)
<img width="1894" height="766" alt="image" src="https://github.com/user-attachments/assets/0241a352-ae03-4059-bbc0-4c1970c17ffc" />
<img width="1896" height="789" alt="image" src="https://github.com/user-attachments/assets/13438597-bebd-4347-8fd9-a4133d676c00" />

# Paleidimo instrukcija ir reikalavimai

### Reikalavimai:
- Node.js (v16 arba naujesnė versija)
- npm arba yarn
- MetaMask extension
- Git

### Programos paleidimas
1. Klonuoti repozitoriją
```
git clone https://github.com/augustetum/blockchain-solidity.git
```
3. Įdiegti Priklausomybes
```
npm install
```
3. Įdiegti Ganache
```
npm install -g ganache
```
5. Paleisti Genache
```
npm run ganache
```
7. Naujame terminale kompiliuoti sutartis
```
npm install -g truffle
truffle migrate --reset
truffle exec scripts/deployEventsAndMintTickets.js
```
9. Konfigūruoti MetaMask
10. Paleisti naudotojo sąsają
```
cd frontend/blockchain
npm run dev
```

Programa matoma `http://localhost:5173`


