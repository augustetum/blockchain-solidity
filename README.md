# Bilietų pirkimo ir pardavimo platforma  
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

<details>
<summary><strong>Viešasis tinklas | Sepolia</strong></summary>

<br/>

## Sepolia testnet prijungimas

Viešojo tinklo **Sepolia** testavimui ir prijungimui prie platformos vykdėme šiuos žingsnius:

1. Susiradome viešą Sepolia RPC URL  
   (`https://ethereum-sepolia-rpc.publicnode.com`) ir jį įdėjome į savo `.env` failą  
   (kurio, deja, negalime parodyti dėl saugumo:)).

2. Atsidarę savo **MetaMask** profilį susiradome dvylikos žodžių *passphrase*, kurį taip pat pridėjome į `.env` failą.

3. Pasinaudojome **Google Cloud Web3 Sepolia faucet**, kad gautume testinių ETH.

4. Sukonfigūravome `truffle-config` bei `Web3` failus, jog jie veiktų su **Sepolia testnet**.

---

### Testavimo eiga

#### 1. Bilieto sukūrimas blokų grandinėje

Testavimo pradžioje sukūrėme testinį renginį ir priskyrėme vieną bilietą savininkui.  
**Etherscan** aplinkoje matome, jog NFT sėkmingai priskirtas *Account1* MetaMask piniginei.

<p align="center">
  <img src="https://github.com/user-attachments/assets/8b7fb468-c8db-49ff-a0d1-0c9cb5f05ced"
       width="900"
       alt="NFT priskyrimas Etherscan aplinkoje"/>
</p>

---

#### 2. Bilieto atvaizdavimas platformoje

Atsidarę programą matome, jog bilietas sėkmingai atvaizduojamas vartotojo profilyje.

<p align="center">
  <img src="https://github.com/user-attachments/assets/b337bfe3-5695-4546-abe5-fde908388088"
       width="900"
       alt="Bilietas platformoje"/>
</p>

---

#### 3. Bilieto paskelbimas pardavimui

Pagrindiniame puslapyje bilietų dar nematome, nes jis dar nepaskelbtas pardavimui.

<p align="center">
  <img src="https://github.com/user-attachments/assets/1e01acee-f329-4711-a9a0-6eba611857c0"
       width="900"
       alt="Pagrindinis puslapis be bilietų"/>
</p>

Pasirenkame bilietą ir pradedame pardavimo procesą:

<p align="center">
  <img src="https://github.com/user-attachments/assets/c49d67eb-aa2d-4a87-a022-13deea9cc272"
       width="900"
       alt="Bilieto pasirinkimas"/>
</p>

Patvirtiname NFT perrašymą pirkėjui:

<p align="center">
  <img src="https://github.com/user-attachments/assets/9ecbc55a-f683-4433-a71a-b3387d31dd97"
       width="600"
       alt="NFT perrašymo patvirtinimas"/>
</p>

Įvedame kainą ir dar kartą patvirtiname transakciją:

<p align="center">
  <img src="https://github.com/user-attachments/assets/0671955e-e8af-4743-aa26-5be4a886b92f"
       width="600"
       alt="Kainos patvirtinimas"/>
</p>

---

#### 4. Bilietas paskelbtas platformoje

Sistema patvirtina, jog bilietas sėkmingai paskelbtas pardavimui.

<p align="center">
  <img src="https://github.com/user-attachments/assets/ee407c8a-2e02-4316-be1c-b57cc0955a96"
       width="450"
       alt="Bilietas paskelbtas"/>
</p>

Bilietą matome ir bendroje platformos bilietų skiltyje.

<p align="center">
  <img src="https://github.com/user-attachments/assets/6cdc32d2-b233-4d9b-8b9f-3d387c6eb9b6"
       width="450"
       alt="Bilietas marketplace"/>
</p>

---

#### 5. Bilieto pirkimas kitu profiliu

Prisijungę kitu vartotoju (turinčiu **0.05 ETH**), galime nusipirkti bilietą.

<p align="center">
  <img src="https://github.com/user-attachments/assets/903bd28b-f3ab-40d8-87c9-4eacbecad8db"
       width="900"
       alt="Bilieto pirkimas"/>
</p>

Patvirtiname pirkimą MetaMask aplinkoje:

<p align="center">
  <img src="https://github.com/user-attachments/assets/0b0fd741-bd6f-436c-b6fa-a4a80b20678b"
       width="600"
       alt="Pirkimo patvirtinimas"/>
</p>

Po kelių sekundžių bilietas jau matomas naujo savininko profilyje 🎉

<p align="center">
  <img src="https://github.com/user-attachments/assets/6a05f01d-8e10-44d2-b4eb-725454647e0c"
       width="900"
       alt="Bilietas naujo savininko profilyje"/>
</p>

---

#### 6. Transakcijų patikrinimas

Lengviausia visą eigą sekti **MetaMask**:

<p align="center">
  <img src="https://github.com/user-attachments/assets/cb010372-0941-4d2f-b7eb-2682c8d37a7e"
       width="400"
       alt="MetaMask transakcijos"/>
</p>

Taip pat visos transakcijos matomos **Etherscan** aplinkoje:

<p align="center">
  <img src="https://github.com/user-attachments/assets/69aaf7b7-626c-4e59-9a84-0fa97af17bc0"
       width="900"
       alt="Etherscan transakcijos"/>
</p>

</details>

<details>
<summary><strong>Privatus tinklas | Ganache</strong></summary>

<br/>

## Ganache prijungimas

Ganache paleidimas jau aprašytas žemiau esančioje "paleidimo instrukcija ir reikalaimai" skiltyje, todėl nesikartosime.

Ganache testavimas vyko labai panašiai kaip ir Sepolia tinkle, tik čia kilo mažiau konfigūracinių nesklandumų.

Čia taip pat iš anksto sukūrėme keletą pavyzdinių renginių ir bilietų jiems:
````
========== Deploying Event Ticket Contracts ==========
Marketplace: 0x0517a53bBCA7402ad8452cC801e30e93D430e223
Owner account: 0x961093cb4CD1923a4Aa5bdE0Ac48d2eDD5Ec242B

[1/6] Deploying: Jessica Shy | Vingio Parkas
  ✓ Contract deployed at: 0xe730be3C37E470B710b8C484AA32d308335796Bb
  ✓ Approved on marketplace (tx: 0xda373bb480bd5a884457d4d90cfdc7229d0e655a254d20b06a009a9dfcce677f)
  Minting 5 sample tickets...
    • Token #0: VIP-A-1 → Account 0
    • Token #1: VIP-A-2 → Account 0
    • Token #2: VIP-B-15 → Account 0
    • Token #3: Section-C-23 → Account 0
    • Token #4: Section-D-45 → Account 1
  ✓ Minted 5 tickets

[2/6] Deploying: Vaidas Baumila | Žalgirio arena
  ✓ Contract deployed at: 0x0A7D07f9ca664E3b2D21BceF53c7ec66E52B5036
  ✓ Approved on marketplace (tx: 0xffbb30892f771eef46507568a0106c2ca5af85430211d6f64579423d5eea75f7)
  Minting 4 sample tickets...
    • Token #0: Floor-A-12 → Account 0
    • Token #1: Floor-A-13 → Account 0
    • Token #2: Balcony-B-8 → Account 0
    • Token #3: Balcony-C-21 → Account 0
  ✓ Minted 4 tickets

[3/6] Deploying: JUODAS VILNIUS 2026
  ✓ Contract deployed at: 0xe26fC48Ed0Ff931aEBB036e765041E8942676931
  ✓ Approved on marketplace (tx: 0xc3b08e1506cb725f2d55d8dce1e6221dd025c0aa916868745f38fa32c124bf5a)
  Minting 6 sample tickets...
    • Token #0: GA-001 → Account 0
    • Token #1: GA-002 → Account 0
    • Token #2: GA-003 → Account 0
    • Token #3: VIP-1 → Account 0
    • Token #4: VIP-2 → Account 0
    • Token #5: VIP-3 → Account 1
  ✓ Minted 6 tickets

[4/6] Deploying: Kings of Leon | The only show in the region
  ✓ Contract deployed at: 0xdC74abcC482e1B26934819fF74432A338bC2B81a
  ✓ Approved on marketplace (tx: 0x97364a21450d55e0b7dbf453c94497c56f6a6823450b4ad8245df100d65e0c5d)
  Minting 4 sample tickets...
    • Token #0: Pit-A-5 → Account 0
    • Token #1: Pit-A-6 → Account 0
    • Token #2: Section-101-12 → Account 0
    • Token #3: Section-102-8 → Account 0
  ✓ Minted 4 tickets

[5/6] Deploying: Andrius Mamontovas: TIK HITAI
  ✓ Contract deployed at: 0x6FDc4ED11D61956a0090adf8027dAd1db231f7fF
  ✓ Approved on marketplace (tx: 0xdf84fab6b54270061a0dd40f56b1cf70403449fd9826d02950c94bb869128ba5)
  Minting 4 sample tickets...
    • Token #0: Row-A-10 → Account 0
    • Token #1: Row-A-11 → Account 0
    • Token #2: Row-B-15 → Account 0
    • Token #3: Row-C-20 → Account 0
  ✓ Minted 4 tickets

[6/6] Deploying: punktò ~ KAUNAS
  ✓ Contract deployed at: 0x7976665e956443CDCa51a07048845A3d07e6A73C
  ✓ Approved on marketplace (tx: 0x7773b0a323c6b2f48873a412537e7ac3c63250d737089f338e7cc157196e0c7d)
  Minting 3 sample tickets...
    • Token #0: Standing-001 → Account 0
    • Token #1: Standing-002 → Account 0
    • Token #2: Standing-003 → Account 0
  ✓ Minted 3 tickets

========== Deployment Summary ==========
Total Events: 6
Marketplace: 0x0517a53bBCA7402ad8452cC801e30e93D430e223

Event Contracts:

1. Jessica Shy | Vingio Parkas
   Address: 0xe730be3C37E470B710b8C484AA32d308335796Bb
   Tickets Minted: 5

2. Vaidas Baumila | Žalgirio arena
   Address: 0x0A7D07f9ca664E3b2D21BceF53c7ec66E52B5036
   Tickets Minted: 4

3. JUODAS VILNIUS 2026
   Address: 0xe26fC48Ed0Ff931aEBB036e765041E8942676931
   Tickets Minted: 6

4. Kings of Leon | The only show in the region
   Address: 0xdC74abcC482e1B26934819fF74432A338bC2B81a
   Tickets Minted: 4

5. Andrius Mamontovas: TIK HITAI
   Address: 0x6FDc4ED11D61956a0090adf8027dAd1db231f7fF
   Tickets Minted: 4

6. punktò ~ KAUNAS
   Address: 0x7976665e956443CDCa51a07048845A3d07e6A73C
   Tickets Minted: 3
````
Lyginant su Sepolia, mintinome daugiau bilietų ir renginių, tad ir sąsaja atrodė pilnesnė:
<img width="1512" height="857" alt="Screenshot 2025-12-18 at 03 52 07" src="https://github.com/user-attachments/assets/d96f9a07-bf60-4cc0-a23d-0f21a020e171" />

Transakcijas sekėme tiesiog komandinėje eilutėje, pvz.:
````
  Transaction: 0x1e6813b0f0cf3a5cc9e1f8abf48a4045aadb171dda8eb8b9aa45e5d055618ab0
  Gas usage: 88631
  Block number: 60
  Block time: Thu Dec 17 2025 12:16:59 GMT+0200 (Eastern European Standard Time)
````
</details>

## Naudotojo sąsaja (angl. _front-end_)
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
5. Paleisti Ganache
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


