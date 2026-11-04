// Épisode 02 : données seules, le rendu est fait par /jeu/moteur/missions.js.
// Les textes sont brouillés et les réponses ne sont stockées que sous forme d'empreinte :
// les joueurs (y compris l'auteur du site) ne peuvent pas se spoiler en lisant ce fichier.
// Fichier généré, ne pas modifier à la main.
window.EPISODE = {
  "id": "ep02",
  "numero": "02",
  "titre": "Le Bureau des Doublons",
  "lieu": "Chine",
  "statut": "en-cours",
  "fuseau": 8,
  "roles": {
    "dj": {
      "nom": "~IAkUD08uAAoOAxcR",
      "surnom": "~MwcIBQkIGw==",
      "numero": "~MyZMUV9fWU5ZVEJQXSk=",
      "fiche": [
        "~PgcMQ63aT4bP9lJfUCsuKikrKjc=",
        "~IBqiygECAkOq0lKA4OVBWU89DhYERVoGHwYVBhwZrMpB",
        "~PgkVCgADDg8BEbHMUKrWQ4r20oTZ6FJfUC4TAgGuyAIBFhc=",
        "~IBoOBQoeHAoHC1IBs8ECDw4frMoNRbDSUI/10Innyovp6Zbd6khbQysn",
        "~IBoOBQoeHAoHC1IGHwYSFw4ZrMoNRbDSUI7B24rD8Yvp6Zbd6khbQysIAgIGARcQAkgFge/0Cg4YCR0M",
        "~MQQIAhxNDAwGCwdFst9BhufGivPlRUhFID4t",
        "~MQYVoMYOrMoMABwRA0ij1E+FwdON2OdFSkgvge/0DkMYBAFFABoIEE8eAA1IEQAEGQZBAhpNHQYcCgcXUAwUQykuJC0xICQgXkgzAh8MGxEBpttFAAkTQwMMTxUHDAYQAg1BBwpNOwsHCBMWXg=="
      ]
    },
    "auv": {
      "nom": "~IAkUD087DhkNCR4A",
      "surnom": "~JgkbBgMBCg==",
      "numero": "~MyZMUV9fWU5ZVEJQXSo=",
      "fiche": [
        "~PgcMQ63aT4bP9lJfUD4gOSohIyY=",
        "~IBqiygECAkOq0lKA4OVBWU89DhYERVoGHwYVBhwZrMpB",
        "~PgkVCgADDg8BEbHMUKrWQ4r20oTZ6FJfUC4TAgGuyAIBFhc=",
        "~IBoOBQoeHAoHC1IBs8ECDw4frMoNRbDSUI/10Innyovp6Zbd6khbQysIAgIGAVJDUDsUEx8BFkM4CRMLHg0T",
        "~IBoOBQoeHAoHC1IGHwYSFw4ZrMoNRbDSUI7B24rD8Yvp6Zbd6khbQzkIAQcNEABFFA1BJwABBhMaBBwA",
        "~MQQIAhxNDAwGCwdFst9BhufGivPlRUhFNhoOEAofWFY=",
        "~MQYVoMYOrMoMABwRA0ij1E+FwdON2OdFSkgxCwAZAEMJAxQMEwCiygpNCg1IARcTEQYVFh0ITwcdRQAAAxwAFh0MARdIIwcPGRwAT08dABYaRREKHhsODgIMGwoHC1IACAsEEBwEGQZG"
      ]
    }
  },
  "textes": {
    "barre": "Bureau central des homonymes · 同名管理局",
    "eyebrow": "Protocole Espigoule · épisode 02 · Chine",
    "intro": [
      "Contrôle d’identité.",
      "Anomalie : deux Paul.",
      "Un seul sera retenu."
    ],
    "choixRole": "Deux téléphones, deux candidats. Ouvre ton propre dossier. L’autre candidat ouvre le sien sur son téléphone.",
    "choixRoleBouton": "C’est mon dossier",
    "transmission": "Notification officielle",
    "progression": "Formulaires validés",
    "registre": "Registre de Paulitude",
    "valide": "Validé",
    "piece": "Mot du règlement",
    "note": "Note du Bureau",
    "terrain": "Tu es sur le terrain",
    "cle": "Tu as le dossier",
    "deux": "Formulaire à deux",
    "joker": "demander une dérogation",
    "forcer": "demander une ouverture anticipée",
    "contourner": "capteur en panne ? dérogation manuelle",
    "dossier": "Dossier du candidat",
    "mots": "Mots du règlement",
    "autre": "l’autre candidat"
  },
  "etapes": [
    {
      "id": "xian",
      "nom": "Xi’an",
      "zh": "西安",
      "lat": 34.34,
      "lon": 108.94,
      "via": "avion",
      "missions": [
        "M01",
        "M02"
      ],
      "skyline": "skyline-xian.svg"
    },
    {
      "id": "pekin",
      "nom": "Pékin",
      "zh": "北京",
      "lat": 39.9,
      "lon": 116.4,
      "via": "avion",
      "missions": [
        "M03",
        "M04",
        "M05",
        "M06"
      ],
      "skyline": "skyline-pekin.svg"
    },
    {
      "id": "shanghai",
      "nom": "Shanghai",
      "zh": "上海",
      "lat": 31.23,
      "lon": 121.47,
      "via": "tgv",
      "missions": [
        "M07",
        "M09"
      ],
      "skyline": "skyline-shanghai.svg"
    },
    {
      "id": "suzhou",
      "nom": "Suzhou",
      "zh": "苏州",
      "lat": 31.3,
      "lon": 120.62,
      "via": "route",
      "missions": [
        "M08"
      ]
    },
    {
      "id": "chongqing",
      "nom": "Chongqing",
      "zh": "重庆",
      "lat": 29.56,
      "lon": 106.55,
      "via": "avion",
      "missions": [
        "M10",
        "M12"
      ],
      "skyline": "skyline-chongqing.svg"
    },
    {
      "id": "dazu",
      "nom": "Dazu",
      "zh": "大足",
      "lat": 29.7,
      "lon": 105.72,
      "via": "route",
      "missions": [
        "M11"
      ]
    }
  ],
  "statuts": [
    "Suspect",
    "Toléré",
    "Recevable",
    "Candidat sérieux",
    "En attente du verdict"
  ],
  "prefixes": {
    "systeme": "[BUREAU]",
    "zhang": "[ZHANG·0001]",
    "faux": "[ZHANG·0010]"
  },
  "transmission": [
    {
      "qui": "systeme",
      "texte": "~MwcPFx2u2w8NRRaH8PEIBwoDGwocpttFER0VDAIMGwobpttLUC8TDBodCkMMAFITHxEABApNKTFFVENVRURBBQAfAhYEAFIpHwsOEBtNRxAJCwFFFwkTAgEZBgZBSw=="
    },
    {
      "qui": "systeme",
      "texte": "~MQYODg4BBgZIAbHMBA0CF6zECkNSRRYABRBBEw4eHAIPAAAWUAwEQx8frMoGCh9FICk0L0E="
    },
    {
      "qui": "zhang",
      "texte": "~MgcPCQAYHU1ILBwWAA0CFwoYHUMyDRMLF0RBDg4ZHQoLEB4AUFhRU15BTyEdFxcEBUgCBgEZHQIERRYAA0gJDAICARoFAAFL"
    },
    {
      "qui": "zhang",
      "texte": "~MRoVCgwBCkNcRRYQUBqiywgBCg4NCwZFSkgUDU8eChYERSIEBQRBEw4fTwQaCgcVFUZBL43t9gIdEQAAUAwEFQYIARdIp9lFIAkUD08DrdNaRbDeXEiiw08ZBhcaAFIBs8EHCgEEGwoORRcRUBsADRxNDhMYAB5L"
    },
    {
      "qui": "zhang",
      "texte": "~Og1BFQ4EHEMMChwGUKvIFQ4BGgYaRR4AA0gFBhoVTwAJCxYMFAkVEEFNOg0NRbHMABoEFhkITxMJF1IPHx0TT08IAUMMAAcdUBwEDh8eT1lIAZDl6QkDDB0JTxYGRRQKAgUUDw4EHQZIptJFAg0MEwMEHUMNCwEAHQoNBkNNHxYBFlIQHkgFFgoBQUMrDRMUBQ1BBxoIA0MPBBULs8FBEQ4dHwwaERdFBQZBEwAEARdIARdFIAkUDwYZGgcNS1IpFUgjFh0IDhZIERsAHhxBDwpNHQYPDAERAg1P"
    },
    {
      "qui": "zhang",
      "texte": "~MwAAABoDTwcNRQQKBRtBDQpNHQarwh0MBEgQFgpNAwJICB0MBAGiyk8JChBIDBwDHxoMAhsEAA0bS1IrFUgMDAEZHQYSRRgEHQkIEE8bABcaAFKm2QsTAgFNrMNICZDl6QkUFx0ITwAJCxYMFAkVTU8hCkMqEAAAER1BDQpNDAwFCAcLGRkUBk8cGgZIFh0QA0gMDAFNAgIcFxsGBQQET09dX1NZSw=="
    },
    {
      "qui": "zhang",
      "texte": "~PA1BFQofCwoLEVIWFRoAQx0IAQcdRbHFUCsJDAEKHgoGAl5FHA1BBwofAQoNF1IWHwETT08IG0MPFxMTs8FBBw4DHEMEAAFFERoCCwYbChBGRSIXFQUIBh1NCQwaCAcJEQETBk8MGQIGEVIJFUgFoMYdDhEcS1IzFR0IDwMIFUMYBAYMFQYVBh2P78VIKx0LXEgEDU8LDgocSVIGHwUMBgEOChlG"
    }
  ],
  "missions": [
    {
      "id": "M00",
      "date": null,
      "acte": "Dossier d’inscription",
      "ville": "Paris",
      "lieu": "Contrôle d’identité",
      "terrain": "dj",
      "image": "passeport.svg",
      "commun": "~NgcTDhoBDgoaAFIVAqvIAgMMDQ8NSVKm0EgTBgIdAwoaRRcLAw0MAQMITwIeBBwRUAQEQwuuxhMJFwZLUDgAEE8JjePxptsGAgkPQwICARcapttFs8hBD43t9gIdEQAAXg==",
      "dj": "~JAcPQ6zEDBEJC1IEFg4IAAcIT1JYRQEcHQoODwoeQ0MNC1IBFR0ZQwICGxBIARdFBBoOChxNGxEJDAYWXEgRDwoEARBICgdFEhoIEKzEHE1IIbHMExoIEEIBChBIptJFHIrh+g4YGxENRREEHgwIBw4ZTwcJCwFFHIrh+gAfCxENSVIBFUgGAhoOBwZIptJFFBoOChsIQ0MLDRMUBQ1BFx0MBhdIARdFGAkUF08IAUMKBAFLemKD9+6P++KK8fOH5OmD9+5NT4H85JDx8UiD9+6P++JIRZDx8Yr14k+P++KK8fNFUIr14o357kOK8fOH5OlBQ4357oH85JDx8Yr14o357mmK8fOH5OmD9+6P++KK8fNFUIr14o357oH85JDx8Yr14k9Njffph+bkkvzggfvsjffpRVKH5OmD9+5Njffph+bkUEiD9+6P++JIh+bkkvzgaY357oH85JDx8Yr14o357kNIh+bkkvzgQ4357oH85FJFkvzggfvsT4H85JDx8UhBgfvsjffpRZDx8Yr14k9Njffph+bkkvzggfvsjffpb3iH5OmD9+5Njffph+bkUEiD9+6P++KK8fOH5OmD9+5NT4H85JDx8UiD9+6P++JIRZDx8Yr14o357oH85JDx8UhBgfvsjffpRZDx8Yr14mWP++KK8fNFkvzggfvsT0OK8fOH5OlBgfvsjffpRVKH5OmD9+6P++KK8fOH5OlBQ4357oH85JDx8Yr14o357kNIh+bkkvzgQ4357oH85HiH5OmD9+6P++KK8fOH5OlBQ4357oH85FKH5OmD9+5NT4H85JDx8Yr14o357oH85FJFkvzggfvsT4H85JDx8UhBgfvsjffpRZDx8Yr14g==",
      "auv": "~PIrh+g4YGxENRREEHgwIBw4ZTxUJRQYAUAyiygwfBhENRUNVUBsYDg0CAwYbSVIAHkgFBhoVTw4HEQFLUCsJAgwYAUMLCgAXFRsRDAEJT6DIRQcLFUgNBhsZHQZIARdFBAlBFw4PAwZGRT4AUAsOBwpNChAcRREAUBkUBk8bABYbRR0HBA0PBhVDZWmK8fOH5OmD9+6P++KK8fNFUEiD9+6P++JIh+bkkvzgQ09Njffph+bkkvzggfvsjffpRVJFkvzggfvsT4H85JDx8WKD9+6P++JIh+bkkvzgQ09Njffph+bkkvzggfvsjffpRVJFkvzggfvsjffph+bkkvzgQ09Njffph+bkUIr14o357mmK8fOH5OlBgfvsjffpRVJFkvzggfvsjffph+bkkvzgQ09Njffph+bkkvzggfvsjffpRVJFkvzggfvsjffph+bkkvzgaU9NJkNIRVJFUEgjQ09NT0NIRTNFUEhBQ09NI0NIb3iH5OmD9+6P++KK8fOH5OlBQ0+P++KK8fOH5OmD9+6P++JIRVKH5OmD9+5Njffph+bkUEhBgfvsjffpRZDx8Yr14mWP++KK8fOH5OmD9+6P++JIRVKH5OmD9+5Njffph+bkUEhBgfvsjffph+bkkvzggfvsT0NIh+bkkvzgQ4357oH85HiH5OmD9+5Njffph+bkUEhBgfvsjffph+bkkvzggfvsT0NIh+bkkvzgQ4357oH85FJFUIr14o357kOK8fOH5OlrQ08/T0NIRVJFUDtBQ09NT0NIJlJFUEhBQ08oT0M=",
      "joker": "~PA1BAAAJCkMNFgZFMSsioOc+Ty8hJyAgXkgtBk8vGhENBAdFBgcUEE8BDgobFhdFFQYVEQofQ0MYFx0TGRsOCh0IAgYGEVw=",
      "dossier": "~Mw0SQxwUAgEHCRcWUBsODRtNCwYbRQYXGQ8TAgIAChBIAQdFKQFBKQYDCE9ICRdFPAEXEQpNCwYbRR8QBAkVCgADHE9IExsABRBBBwpNHxGrzQFFFA1BUE9dX1NIBBwWXkgkDU9cWFNbSVIpFQEDDQYXTxpIBFITBUgUDQpNHxGrzBQMFx0TAhsEAA1IAQdFEwkNABoBTwEBCxMMAg1PQyMITyEdFxcEBURBDxoEQ0MRRQQKGRxBFgFNCQwaCAcJEQETBkE=",
      "piece": "~BQY=",
      "duel": {
        "titre": "~NB0ED08JjePxDBwWExoIExsEAA0=",
        "consigne": "~IAEEER0IQgUNEBsJHA1MAAYeCgIdHV5FFQZBFx0CBhBICBMLEwAEEE8KDgQGBBwRFRtPQyoDTyAADBwAXEgODU8JBhdIgu3WlczVhubHiuvogMrmUFJBEAeuwhcHEF5FGgGm7QEJq+IHSVIHs9FPQyMITyEdFxcEBUgEGwYKCkMEh/L8EQYPDAEOCkMNC1IGGAEPDAYeQUMlBAcTEQESBk8dHQwGChwGGQkVCgADT1lICBMLEwAEQx8IHQcdAFw="
      },
      "empreintes": [
        "019b0628a29b8093fd7d91a49ae4aa1fa7c0a42e59d74dca3805d6d07f4ecca2"
      ]
    },
    {
      "id": "M01",
      "date": "2026-11-06",
      "acte": "Xi’an",
      "ville": "Xi’an",
      "lieu": "Petite Pagode de l’Oie sauvage",
      "terrain": "auv",
      "image": "pagode.svg",
      "verrou": {
        "type": "gps",
        "lat": 34.2403,
        "lon": 108.9381,
        "rayon": 500,
        "nom": "~HAlBMwoZBhcNRSIEFwcFBg=="
      },
      "commun": "~JQYEQx8MCAwMAFIBFUgDEQYcGgZIAQdFJiEoKgpNHAqrzREJFUZBJgMBCkMJRQIAAgwUQx4YCg8ZEBdFEwAOEApNCg1IFx0QBA1PQyMITyEdFxcEBUgAFhweBkMYAAABUAwEEE8OBwwbAAFJUAUAChxNBQIFBBsWUAwEEE8JABAbDBcXA0Y=",
      "auv": "~MwcMExsITw8NFlKm2RwABAoeTwcNRR4EUDgEFwYZCkM4BBUKFA1BFwoBHEMZEJDl6QENEE8eAA0cRRMQGgcUEQuP7/oAEBtFWAQEEE8fDg0PptsAA0gFBk8dChcBEQFFBAcIFxxEQUMsDAFFHA1BDQAADRENRbHFUASD4/YMGhcaAFIGEQYFCgsMG00=",
      "dj": "~MRoCCwYbCkMMEFInBRoEAhpNVUOrxVIWEUgCDAEeGxEdBgYMHwZNQwMMTxMJAh0BFUgCDAIdGwIBEVJURUiiyhsMCAYbS1IwHkgSoMYEHA4NRR4QGUgEDU8MTxMaDAFFBQYEQx8MHRcBAFxFPA1BAAAJCkMNFgZFHA1BDQAADRENRRaH8PGiyhsMCAYbRQIAAgwUEEE=",
      "joker": "~OQRBBgFNHQYbERdFQVtBEBofT1JdRUhFHA1BEKzEBhAFAFIBFUhQVlpbTwJIAB8VHxoVoMZNAwYbRRYABRBBBwofAQoNFwFLUCsOBwpNVUNaSw==",
      "dossier": "~PA1BEKzEBhAFAFIBFUhQVlpbTwcJCwFFHA1BMAcMDg0QDFIAAxxBDwpNHw8dFlIIFR0TFx0EChFIARdFHIrh+gcEHBcHDAAAUAsODQEYCkNSRRcLBgETDAFNV1BYRUJVQEgMDB0ZHE1IKRNFAAkGDAsITxpIBFIVFRoFFk8eAA1IFh0IHQ0VTU8hrMoPABwBFUgNDAwMAwZIX1IQHkgSoMYEHA4NRR6H8PEAFh0MBhdIAxcLFB0EQwsITwsJEAZFFQZBAQ4eTwYGRUNRSF9NQwoZTxYGRRMQBBoEQwOP7/oJEAAEGRxBEQoLChEFptsAUBkUBgMcGgYbRRam2QsEDQEEChBIFR4QA0gVAh0JQQ==",
      "piece": "~BgcYAggI",
      "duel": {
        "titre": "~MwcPAAAYHRBIARdFEgkGFgoZGwYb",
        "consigne": "~MR1BB6zDAQYaS1ImGAkCFgFNHxENCxZFBQZBAQABTwIeABFFQVhBAA4ODgsdptoRFRtBSwAYT1JYRQIABAEVEE8AABELABMQCEgFBk8DjePxDB8VHxoVBk8cGgwBTFIABEgUDU8PAA9IExsBFUZBIhpNHAoPCxMJXEgVEQ4DHAWrzAAACkUNBhxNGg0NRQIEAkgUDQpNDhUNBlITHxtBAQ4KGgYcERcWXkgtBk8dHQYFDBcXUBkUCk8MTxUBAbHMUBsODU8PAA9IAhMCHg1PQzoDCkMLBBEEGB2iyxsITxIdDFIRHwUDBk8fChcHEAALFUgAFk8JrMoYBAARXg=="
      },
      "empreintes": [
        "2e0d03a0c13007b2e293e138a66aae96cf83b375b1cb44d905e4f28416516af8",
        "1f4d02fab817765ef04fd10e8ab38a6ee1858fdbfa8bc95f08282cb2856f3240"
      ]
    },
    {
      "id": "M02",
      "date": "2026-11-07",
      "acte": "Xi’an",
      "ville": "Xi’an",
      "lieu": "Armée de terre cuite",
      "terrain": "dj",
      "image": "guerriers.svg",
      "verrou": {
        "type": "photo",
        "consigne": "~IAGiywwIT6DIRREKHh4IABsEAA1IX1IVAg0PBxxNGg0NRQINHxwOQwsITw+K5esEBRwTBk8ODg0MDBYEBEgFAgEeTw8JRQIKAw1BB43t9hYGRRUQFRoTCgofTwcNRQYAAhoEQwwYBhcNS1InAgkSQwMITw8HCxVFFB1BAAAfHxBERQAAFwkTB08JHQwBEV5FER0CFgEIT6DBCB0RGQcPTU8oAw8NRQAAAxwEQwsMARBIER0LUByiygOuxhMAChwAXg=="
      },
      "commun": "~IwEZQwIEAw8NRQEKHAwAFxxNC4Ho/BMXFwENBkNNGwwdFlIBGQ4HoMYfCg0cFl5FEQQIBAGuxhBIARcVBQESQx8BGhBIARdFQkhTU19NDg0bS1I1ERtBFgFNHAYdCVIBHx0DDwADQUMkAFInBRoEAhpNChAcRRgEHAcUG0E=",
      "dj": "~JBoOFhkITw+K5esEHgaiygpNAKDRRRYAA0gRAhYeDg0bRQEKHhxBFwAADaDBFlIWBRpBDwoeTxMaAB8MFRoSQwgYChEaDBcXA0gEDU8OHQYdFhMLBEgUDU8dGgocFlxFNQQNBk8IHBdIBBQDGQsJoMYITxMJFwYKBRxBEBofTxMEBBEAXkglChxAAwJIptJFHIrh+g4YGxENRREEHgwIBw4ZQQ==",
      "auv": "~PA1BAAAJCkMNFgZFHIrh+g4DAaDBAFIUBQ1BFwpNCwwGCxdFHIrh+g4YGxENRREEHgwIBw4ZQ0OrzBEXGRwEQ6zNTw+K5esAHh4EERxDTy0NRR4QGUgFChxNHwIbRR4EUBqiywgBCkMJExMLBEgFge/0DhUHDABFHIrh+g4DAaDBAFw=",
      "joker": "~PIrh+g4DAaDBAFIAAxxBUlZaW01IJh0BFUhbQ1taVlJG",
      "dossier": "~MR0CFgFNCBYNFwAMFRpBDY3t9gJICRdFHavLDgpNGQobBBUAXkii408BjePxCgAMFwEPBkNNBg8bRbHMBAkIBgEZTxMNDBwRA0gFBk8OABYEAAcXA0gXChkIHE9IFAcMUBuD4/auxgAJDB4JFQYVQwoDTxIdAB4UBQ0SQwIEARYcAAFFER1BAAADGwILEVIBFUgNge/0DgoaRUhFE4rh+goeG0MdCxdFFA0SQx0MBhAHCwFFAAcUEU8BChAZEBcJHA0SQxoDCkMPFxMLFA1BEw4fGwoNRRYQUBsIFwpNAYHo/BcWBEgVDBoHABYaFlIVERtBBQAYBg8EptsAXg==",
      "piece": "~FA0=",
      "duel": {
        "titre": "~MwAADh8EAA0GBAZFFA1BAQAYAwYbRREEAhqiygoeQ0OrzBYMBAEODU81BoHo/BML",
        "consigne": "~Mw1BEAAEHU9IptJFHIrh+geu2xcNCVIKBUgAFk8fChAcBAcXEQYVTU89ABANH1IQHg1BAQ4KGgYcERdFs8hBBwoYF0MFptoRAg0STU8uBwILEBxFHAkPAApNGxEHDAFFHQcTAAoMGhtIARdFAx0CEQpNRwwdRRam2RtNQwAYTxcHEAZFHwoLBhtNDBYKDAMQFUFBWU8BCkMYCQcWUBgTDAwFCkMMAFIJEUgDAggYChccAFICEQ8PBkNNDAwFCBdFs8hBDw5NH6DBERMLAR0ETU8hChBIARcQCEgCAgEJBgcJEQFFs8EVAgEZTxIdBB4MFgGiyhxNCg1IBh0IAKvIFwYZBgwGSVIJFUgjFh0IDhZIC5Dl6QkCAAodGwZIBAcGBQYEQwoVDBYbAFw="
      },
      "empreintes": [
        "a681e9324db71dfdd31952aeb21a755ea7906697f24bb0d1cecbd9f3c007adff"
      ]
    },
    {
      "id": "M03",
      "date": "2026-11-08",
      "acte": "Pékin",
      "ville": "Xi’an → Pékin",
      "lieu": "Jour de transit",
      "terrain": "auv",
      "image": "avion.svg",
      "commun": "~OgcUEU8JCkMcFxMLAwEVTU89Cg0MBBwRUAQEQxkCA09ICRdFMh0TBg4YTwJIFRMWA6vIQxkCHEMKBBUEFw0SQw4YTxALBBwLFRpPQyMITxENCRcTs8FBDQpNDAwaFxcWAAcPB08dDhBIptJFBgcVEQpNC6DBBh4EAgkVCgADQQ==",
      "dj": "~NKvIAAMMHQIcDB0LUAwEQw0MCAIPAAFJUBsIBAGuxgZIFRMXUAQEEE8JChYQRREEHgwIBw4ZHEMJEFIBs8ERAh0ZTwcNRSIEAgESQ1VnZaHfRQcLUAsAEB4YCkMJEBYMH2Kj1E8YAUMKChwLFRxrodhNHAoQRRAKBQQEEE8ODhEaptsAA2Kj1E8JChYQRRQJEQYSaa3aTxYGAFIVEQETBk8JCkMEEBwABBwEEE8JCkMaABENEQYGBmWv2EMdC1IEFAkRFw4ZChYaRQEAExwEFh1nZS+K5esEBRwTBk8ODg0MDBYEBEgAQwMITxENCRcTs8FBBxpNHAAJCxwAAkZBIAAAHwIaAAhJUBsADRxNAgwGEQAAAkgXDBxNrMoLFxMLA0ZBLwpNDAwMAFIAAxxBD43t9gwKDxcRUAYODU8JrMoLCRMXs8FNQwoDTxYGRR8KBEY=",
      "auv": "~Ig0NBhmuxkMMEFIWEwkPDQofTwcNRQEKBRwET08JDg0bRR6H8PEOEQsfCkMMEFIRERgIEE9XZWmq0lIHH6vPFwYIHUMaDBUMFA1BoM9NDREHBhoAA0gMoMYZDg8EDAMQFRtrodhNHAoQRREQEg0SQwsIARANFl5FHxoIBAYDCkMbFR0XBAEXBmWv2EMcAAoRGQQEQxsfBgAHEbHMUAwEQwkCHQ4NRREXs8oPCgoDAQZip8VFEgeizRsITwcNRREKHRgTCgKuxhBICBMXAR2iygpNKywkLCI3MSYkQ15dX1Nip8VFHQcPFxofCkOrzAMQGRiiygpNCwZIARcQCEgXBh0fChBip8VFFA0UG08JBhAZEBcWUAIAFgEIHE9IEQAAHQoNDBsMARcbb7DSUAkTAAoMGkMbCgcVHA1BDhoDBkMMAFIBFR0ZQwwCHhYNFnhvPIrh+g4YGxENRREEHgwIBw4ZTwJIEx0RAg1BB6zEDA8JFxMRGQcPTU8uAA4YBAAACkRBEA4DHEMFChwRAg0TQxkCHEOrzBEXEQYSTU8hCkMLChYAUA0SF08BjePxChAPFRxBDQADTwerzBEJERqiykNNCg1IEBxFHQcVTQ==",
      "joker": "~JAcUF08IHBdIAbHMEwQAEazETxAJEBRFHAlBAQCuwRcNRRYAUAsODh8fBg6rzAFLUCsOBwpNVUMsCh4MABoADQpD",
      "dossier": "~PA1BIRofCgIdRRNFEwcPBQYeHharzFIJEUgDDKzDGwZERQIQGRtBD43t9gJIFxcLFB0EQ1VNBg9IBFIIEQRBoM9NAwJIEbHPBA1BBwodGgobRSoMkuj4AgFDTyIdRQIEAxsABApBTxUHEQAAUAwEEBsEAQIcDB0LUBuD4/auxgAaDAZFleT2h9XBQ0MqABsPGQYGT0+vxEMLBAIMBAkNBk8JGkMmCgABUKraTU8jDg0DDBxJUI3s9IvXw09Ip9lFEwkRChsMAwZIAQdFIx0FQ63WQUMwDJDl6QkPT08JjePxCrHcUB4OFhxNGQYGAAhFSkiJxtCIwepERbDOUBgAChdNCwZICZDl6ScUBhwZT6HTS1IgBEgyCw4DCAsJDF5FH6vYQxkCGhBIDAAACkhbQ4vV5YXd0l5FssNBEBofTw8JRR8AAkij2EE=",
      "piece": "~HQENDwo=",
      "duel": {
        "titre": "~NRAADgoDTwcNRQCm2RwEDRsEAA1IX1I9GYrh+g4D",
        "consigne": "~JBoOChxNHhYNFgYMHwYST08JBhtIFhcGHwYFBhxNDAsJBgcLFURBAAcMDBYGRQEQAkgSDAFNG6DBCbHMAAAODQpDTy8NRR8AGQQNBhofTxALCgAAUA8ABAEIQUMtC1IGERtBB43t9qDBAhMJGRyiykNNrMoPBB4MBKvITQ==",
        "quiz": [
          {
            "q": "~KAGD4/YMAUOrzAYEGRxBDwpNHwwBCwZFFA1BB6zEHwIaEVIBFUgQFgoBAwZIFx0QBA1BAAAAAgYaBhsEHA1BXA==",
            "options": [
              "~PAlBEQAYGwZIARcWUKvIEwYOChA=",
              "~PAlBEQAYGwZIARdFHAlBEAAECg==",
              "~PAlBEQAYGwZIAQdFBACiyg=="
            ],
            "bonne": "~QQ=="
          },
          {
            "q": "~IR0ED08IAhMNFxcQAkgAQwkMBhdIABwRFRoTBh1NA4Ho/BMXHavIBk8JCkMcAAAXFUgCFgYZCkNX",
            "options": [
              "~IQEPQzwFBkMgEBMLFw==",
              "~Ox0DCgMMBkMjDRML",
              "~IB0YCg=="
            ],
            "bonne": "~QA=="
          },
          {
            "q": "~MwcMAQYIAUMMh/L8s8EVAggIHEMaAAERFUUVTgYBT6DIRR4EUDgEFwYZCkM4BBUKFA1BBwpNA4Ho/D0MFUgSAhobDgQNRU0=",
            "options": [
              "~QV0=",
              "~Rw==",
              "~QVs="
            ],
            "bonne": "~Qg=="
          }
        ]
      },
      "empreintes": [
        "e31250b5bfb550d0686a100fc0ca8f3a65a4a64def87270b69d44433357eb6f1",
        "7771307527328c573ee9149c5fc446ba1ecaf67fa49f2cf6568312a7094d556d",
        "f19eac92a80301db3bdfa72d8c27ec8927e4c24fa4f50e252cc9fdc0661111c2",
        "025e91e758f204d7d24b503d7dc71deecf02e33e6bef3ac6c06cdd17547583c5",
        "8e6c2b375da4162794c9c705caaa65d297bc3703fb9560aee21648a815f9900f",
        "f83134ef6d00a43f4e88fe856fc278cced4b41724220562169755358cdfcb0d6"
      ]
    },
    {
      "id": "M04",
      "date": "2026-11-09",
      "acte": "Pékin",
      "ville": "Pékin",
      "lieu": "Grande Muraille de Mutianyu",
      "terrain": "dj",
      "image": "muraille.svg",
      "commun": "~Ix0TQxkCHEMKDB4JFRwSQwoZTxAdF1IJFRtBEw4DAQYJEApFFA1BD43t9gYGEQCm2Q1NQwMITxABERdFA4rh+qzEDBEBEVKD9f2G99+I3MmB8M2A7+ZPQyMIHEMcFx0MA0gREQoABgYaFlIGERoAABuuxxENFlIWHwYVQwMITw0HCFIBBUgXCgMBDgQNSVIoBRwIAgEUGk1IKRcWUAwEFhdNCwYaCxsAAhtBEAADG0MEAFIDHxoMFgMMBhENRRYQUAIOFh1D",
      "dj": "~NKvIAB0EHEOrxVIJkuj4AhoZHQZIBhMLFAEFAhtNAwYbRRYABRBBBwofAQoNFwFFEwkTAgwZrMsaAAFJUIH03E8dGgobRZf6/kRBFx0MBhdIFRMXUBwTAgYZQ0MbBBwWUAQEEE8AAA0cFxcXXkggFxsIARcBChxFSkgSDAFNAwYQDAMQFUgCDAEZBgYGEVIBFRtBAA4fDgAcptoXFRtBEhoETw8NEABFAg0SEAoADQ8NCwZL",
      "auv": "~PA0ZCh4YCkMMEFInBRoEAhpNVWligM7FUKrWQxsIAQcaAFJNFRxBDQAATwcNRRQEHQENDwpEZYXg9VKnx0gFBhkIAQoab5vwz0ij1E8BAA0Pb5f670ij1E8frMoPDB0Leo3t9E+v2EMGCgABeo3+7U+v2EMFEAAEGQQNBmWFwPlIp8VFAwEPAKzFHQZigcjJUKrWQwwMHwocBB4AeoH2y0+v2EMYCgARFWKE0t5NrdRICB0LBAkGDQpnZS+K5esEBRwTBk8ODg0MDBYEBEgXAk8ZCkMMptsGAgETBk8JChYQRREEAgkCF6zFHQYbS1I3FRwTDBobCk4EAAFFFAkPEE8BCkMEAAoMAR0ETU8hCkMLChYAUA0SF08BChYaRQYXEQwUABsEAA1ICB0RUKvBQwICG09IABxFFhoADazKDgobSw==",
      "joker": "~mf3eQ1JNAwwGAl5FlffvQ1JNAhYaBBsJHA1PQywCCwZIX1IJHwYGFgpNAhYaBBsJHA1PQ0eI08NERR4AUAsAEQ4OG6DAFxdFAAGiywgIQ0MNFgZFHA1BDQAATwcNRR6H8PEIDRwdCgAcAAcXXkE=",
      "dossier": "~mf3ehvDjQ0MrDbHEHg8CC6zEAQRIX1Kn20gNDAEKGgZICAcXEQENDwpNrdhGRSEKHkgPDAJNDAwFFR4ABERBh9fqhuTkjOfalffvT08bChYcRRYMAg1BocRNAhYaBBsJHA1BBwpNCwoQRR8MHAQEQwMET6HTRVoQHkgNCk8LDgocRRcLBgETDAFNWlNYRR9MXkgkF08DAA1ERR0LUAYEQwMMTxUHDAZFAAkSQwsIHxYBFlIJEUgtFgEIT1lICLHPHQ1BOg4DCEMkDAUAGURBDwpNHxENCBsAAkgAEBsfAA0JEAYAUAsJCgECBhBERRNFFAEVQwEITxMJFlIJkuj4AhkCBhFIEwcAUAwEExoEHEMEh/L8HxoDChsIQQ==",
      "piece": "~HAEEFgoe",
      "duel": {
        "titre": "~Pxiiyh0MGwoHC1IjBRoVChkI",
        "consigne": "~NIrh+gYOBkMEAFIBs8YPBh1BTwAABBEQHkgFDAYZTxMACgYKFxoAEwcEChFICZDl6QkUFx0IT6DIRQEKHkgIDRwYQ0MMAFIVAqvIBazEHQYGBhdFFAkPEE8YAQZIFR0WBB0TBk8dChZIChQDGQsIBgMBCk1INhtFBB1BEBofHxENCxYWUASD4/YMGhcaAFIAHkgVEQ4EAUMMAFIRFUgXChwIHU9IARsWUKrKQykYHRcBExdFstNBWU8eDkMcABwRERwIFQpNChAcRRMLHh0NoMYITwYcRRsJUAwOChtNHQYLCh8IFQYCBh1DTy8NRQIXFQUIBh1NHhYBRR8KHhwTBk8YAQZIFRoKBAdBBRofGwoeAFIXs8EUEBwECkMPBBULFUZBLwpNDAIbRbHMEwCiyg4DG09ICRNFAAQUEE8fBgcBBgcJFUgNge/0Cg4YCgARFUY="
      },
      "empreintes": [
        "4f6a464333fb086e20d8f334006afc68069b268b7e60bd9cd7275fe28cae7f43",
        "3b15ece34c5f63d9f7361ce4132e464e07e8f89fd84ba4a6b31d6db478beb4d0",
        "a4b43f2dde8c0c4629b2d0bea888653efa115d76640e578bbcb56e113e91cf9c",
        "1755b2ca42a1e4cb1864aa1d5584290bb00c5b648a97e79bccda61ad9a3800b8",
        "7869411ae07183aae21fd8cec87bc864458885f70d7a4f9e513e2b7e8a4753e4",
        "752d239fec4ad6969e847723301f6f97d1be9748c9114ea78c14cf3d4bb3c700"
      ]
    },
    {
      "id": "M05",
      "date": "2026-11-10",
      "acte": "Pékin",
      "ville": "Pékin",
      "lieu": "Cité interdite",
      "terrain": "auv",
      "image": "toit.svg",
      "verrou": {
        "type": "boussole",
        "cap": 180,
        "tolerance": 25
      },
      "commun": "~PAlBIAYZrMpIDBwRFRoFChsITwYbEVIVHxuiygpNHBYaRQcLUAkZBk8dDhEOBBsRXkg1DBoZChBIFhcWUBgOERsIHEMaABUEAgwEDRtNCwIGFlIJEUgMoMUACkMMDAAAExwIDAFDTy8NRRQKAgUUDw4EHQZIAQdFGgcUEU8DCkMbAFIXFQURDwYZTxIdAFIBEQYSQwwIG0MJHRdL",
      "auv": "~NA0XAgEZTw8JRSEEHAQEQwsITw+K5estERoMDAEECkMbEAIXs8IMBk9FAwJIFR4QA0gGEQ4DCwZBSVIXFQ8AEQsITxYGRREKGQZBBxpNGwwBEVxFMwcMExsITw8NFlIVFRwIFwoeTwUBAgcXGQYEEE8MAwoPC7HMFRtBEBofTw+K5esEAqvLFwpBTwYcRRam2QsTChxNAwJIFQAAHQGiyx0ITwcNRR4EUA4IDwpNrMNICZDl6QkUFx0ITwAJCxYMFAkVTQ==",
      "dj": "~IAcUEU8JrMoKCR0UBQ0TQwMITwUHFx8QHAkIEQpBTw+K5esEBRwTBk8ODg0MDBYEBEgFDAYZTxcNCxsXUBsODU8ZrMoEptsVGAcPBk8JDg0bRR4EUAwIEQoOGwoHC1IKs9FBEQoKDhEMBBsRUASD4/YIAhMNFxcQAkgAEBwEHEMbEABFAwcPQxsfrNcGAFJfUAsEDwMITwcdRQEKHA0ID08JCkMFDBYMXkglChxAAwZFCQcMXmJrJgEeGgocAFJfUAQAQwkEAwZIARdFFgEGFh0EAQYbRRcWBEgMBgGuxgZIFRMXUB0PQwcCAg4NRRENFR4AFgwFDg0cRQcLUAcIEAoMGk9IFAcMUAYEQwwCAhMcAFIVERtPQyMITwAHARdFFRsVQwMITw0HCBAXFUgFge/0Dg0BCBMQCEgFBh0fBqDAFxdFHB0ITQ==",
      "joker": "~PA1BFx2u2w0NRQAAFwkTBwpNAwZIFgcBXkglChdNDg0BCBMQCEgSFh1NA4Ho/BMXs8IVBkNNHw8dFlIJkuj4CwAAAgZIFgcXUBsODU8CBhANBAdLUCsOBwpNVUNZVVw=",
      "dossier": "~PAlBMA4BAwZIARdFHIrh+icMHQ4HCxsAUBsUEx2uxQ4NRRcWBEgNBk8eChYERRCm0hwIDgoDG0MMAFImGAEPBk+uz0MYCgARFRpBUl9NCQoPEAAMHg0SQ1VNAwZICBMdGQUUDkNNHaDBFhcXBqvIQ6zNTw+K5esAHRgEEQoYHU1IKRcWUAkUFx0IHEMbBB4JFRtBBgFNAA0cRUtJUF9NQ1qP78VIKZDl6QAODgIITwYGRQam2hwEQwsITwUBCRdFAw0TAgYZTxYGRQIXGQYCBk8OHRYNCVIGHwYFAgIDrMpIptJFAg0SFwofTw+rxV8NER0VQ1VNHIHo/BsJUAkXAgEOCk9IDB5FBAcMAQpD",
      "piece": "~EwcMDgoDDAY=",
      "duel": {
        "titre": "~MwAAEBwITwIdHVIJGQcPEA==",
        "consigne": "~PA0SQx8CHRcNFlIWHwYVQwgMHQerzBcWUBgAEU8JChBIBh0QAAQEEE8JCkMEDB0LA0gFBk8PHQwGHxdFSkgNBk8ArMEEAFIVHxsEQwMMTxMJEQYAUBsUEU8YAQZIBx0QHA1NQwMMTwUNCBcJHA1BEBofTxYGRR4MHwYCBg4YQUMkAFIVAg0MCgofTxIdDFIVGAcVDAgfDhMADBdFBQYEQwkIAgYECRdFER4EAE8eAA1ICRsKHgsEAhpNChdICRNFHQcPFx0IT6DIRR6H8PEAFhsfCkMPBBULFUY="
      },
      "apres": {
        "commun": [
          {
            "qui": "zhang",
            "texte": "~JQYEQx8frMoLDAEMHwZBAgsABg0BFgYXERwIFQpBTxMHEABFHAlBFx0MARAYBAAAHgsETQ=="
          },
          {
            "qui": "zhang",
            "texte": "~PQcPQwECAkMLCh8VHA0VQwoeG0MyDRMLF0gjpOECAxar1lxFlNf8hNL6QQ=="
          },
          {
            "qui": "zhang",
            "texte": "~Mq/vDAMYrNBERRGH8PEEEBtNDgoGFhtFAR2D4/YCAUOrzBEXGRxBocRNPwIdCVKny0gEDU8OBwoGChsWXg=="
          },
          {
            "qui": "systeme",
            "texte": "~MwcPBQMEG0MMh/L8GQYVoMYfrMkcFlIBs8EVBgwZrMpGRTEJERsSBgIIARdIX1IWEQYSQxwYBhcNSw=="
          },
          {
            "qui": "zhang",
            "texte": "~Og1BEQoeGwZIFRMXFgkIFwoACg0cRRsIAAkTFwYMA01IpvsTGQwEDgIIARdG"
          }
        ]
      },
      "empreintes": [
        "4ab37ba6c54a1b2ea9d7d4806d05661fb0b99f86c79805bf5b9d8015d677b27d",
        "9414eb5805898bdee1c03c94b7bb0a0194ffb8bd8fa567a6cc91d205b339d7ca"
      ]
    },
    {
      "id": "M06",
      "date": "2026-11-11",
      "acte": "Pékin",
      "ville": "Pékin",
      "lieu": "Temple des Lamas",
      "terrain": "dj",
      "image": "bouddha.svg",
      "commun": "~JQZBAQAYCwcABFICs8EADRtNGwIBCR6m2UgFAgEeTxYGRQEABQRBFx0CAQBIARdFAwkPFw4BQUM9CxdFAAkTFwYITwcNRR4QGUgEEBtNBg0eDAEMEgQET08OAA4FAFIJFRtBEQobCg0dFlIBkuj4FgFNKylG",
      "dj": "~NA0XAgEZTw8NRRUXEQYFQw0CGgcMDRNJUBwTDBobCkMbEABFBQZBEw4DAQYJEFIWEUgJAhoZChYaRRMQXQwEEBwYHEMMEFIWHwRNQwoDTw6rzQYXFRtPQysEHE4EBFKm0EgNge/0DhYcFxdFEwkPBwYJDhdG",
      "auv": "~MRoCCwYbCkMMEFInBRoEAhpNVUMEBFIWBAkVFgpNAgYbEAAAUFpXQwJNCg1IER0QBERBDg4EHEMdCxdFAAkTFwYITwYbEVIAHhwEER2uxgZIFR0QAkgQFo3t9gYECRdFBAEEDQEITwcNBx0QBEZBLwpNDAwMAFIAAxxBDwpNAQwFBwAAUAwEQwKuxxcaAAFFAwcUEE8ZChEaAFw=",
      "joker": "~QVBBDk8bBhABBx4AA0RBUVlNDhZIER0REQRPQywCCwZIX1JdXg==",
      "dossier": "~Mw1BLg4EGxENHBNFFA1BUVlNAkNAVEpFER1MBwoeHBYbRRYQUBsOD0NNV0MMAAEWHx0SSk8LBgQdFxdFER1BJBoEAQ0NFgFFFA0SQx0IDAwaAQFFEwcMDgpNAwJIFR4QA0gGEQ4DCwZIFgYEBB0EQxsMBg8EptsAUAwADRxNGg1IFhcQHEgVEQADDE1IKRdFAwkPFw4BTwIdFxMMBEiiyhuuxkMHAxQAAhxBoM9NA4Ho/BcIAA0TBhofTzIBBBwJHwYGQx8MHUMEAFJSFUglAgMMrMxFKRMIEURBBhtNAwZIEx0cEQ8EQwUYHBIdh/L8s8hBM6zEBAoGRRMQAgkIF08JGhGrzFIRAgcIEE8MARBG",
      "piece": "~BAcUCQAYHRA=",
      "duel": {
        "titre": "~MgcVFwMITwUEDAJFAqvIBAMIAgYGERMMAg0=",
        "consigne": "~s+hBD43t9gur0QYAHERBFgEITwEHEAYAGQQNBk8JjePxABMQUKvBQwICBhcBpttFAAQECgEIQUMrDRMGBQZBDw4DDAZIptJFAwcPQxsCGhFIX1IJEUgDDBoZCgoECRdFFAcIF08LDgoaAFIQHkgVDBofTwYGRR6H8PEACh1NChdIFxcRHwUDBh1NCwYKCgcRXkgtBk8dHQYFDBcXUKvBQxsfAAobRQCm2R0SEAYZChBIAhMCHg1PQyMITyEdFxcEBUgVDAOuxxENRR4AA0gCEQYeQ0MYBAFFHA0SQwuuxgSrxwYWUAwEEE8IDhYQS1ImHwUMBk8MGkMuEBgMBAlNQwMITxMNFxYEHhxBEw4ECkMEBFIRHx0TDazECk0="
      },
      "empreintes": [
        "c0413dc610934bbb81c5163431a505fed45241f298e1f8d160a47da1dc91d0ff",
        "432de75215eb595f38ff134f66d5017e81c31ff728fd636a24f6194282a18cfe"
      ]
    },
    {
      "id": "M07",
      "date": "2026-11-12",
      "acte": "Shanghai",
      "ville": "Pékin → Shanghai",
      "lieu": "TGV",
      "terrain": "deux",
      "type": "synchro",
      "image": "tgv.svg",
      "commun": "~NgcTDhoBDgoaAFIBFUgVEQ4DHBMHFwZLUCQEQwwCCwZIAQdFGgcUEU8MHREBExdFFQZBBwoYF0MFChsRGavIEE8cGgpIBhoEHg8EDRtNGwwdERcWUAQEEE9eX0MbABEKHgwEEEFNLhAbAB8HHA0bTgMIHEMJExMLBEgQFo3t9gYECRcWUA0ZEwYfCg0cSw==",
      "dj": "~JAlBDgAEGwqrzFIBBUgCDAsITxCK5esEFg4IAAcITwABSBYAAxsOFhxDTy+K5esEBRwTBk8ODg0MDBYEBEgAQwMMTwAHCwEMFwYEQwuP7/oJFgEAHQoNAggIQQ==",
      "auv": "~MwcPEAYKAQZIAZDl6QkSEAoADQ8JAhdFSkgNBk8OAAcNRRQEGRxBV08OBwoOAwAAA0ZBJ43t9gIKCgABUAQAQwICBhcBpttFFB1BJyVBTxMdDAFFHAlBFwYIAQ0NS1IxERgEGUIBCkMLDRMGBQZBEBofTxUHEQAAUByiygOuxhMAChwAXEgAFQ4DG0MZEBdFHA0SQwICBhcBptsWUAsJAgEKCg0cSw==",
      "fauxPour": "dj",
      "faux": [
        {
          "qui": "faux",
          "texte": "~Ig0CFwYLBgAJERsDUFJBDgoZGwYSRRaH8PEAAQAfC0MEBFIIHwEVCqzETwcNRR6H8PEgFhkIHQQGBAZJUBgUChxNDAYECRdFFB1BJyVDTywaAQAAUAkNEwcMDaDBERsUBQ1BBwoeTxGrzBUMHwYSTQ=="
        }
      ],
      "joker": "~PA1BEQoOGwoODBEEBAEHQ6zEGwIBEVIWGQ8PoMZNCxZICBMRAgECFgMIT1NYVEJLUCSD4/YEARAYABERFR0TQzUFDg0PSVIGkuj4BhwZT1NYVUNLUCQEQwwCCwZERRGH8PEEEBtNAwJICB0MBAGiyk8JGkMsL1IVBQESQwwIAw8NRRYAUASD4/YsGhUNFxULERxP",
      "dossier": "~JgcVEQpNGxEJDBxFAg0NCgpNP6DBDhsLUKvBQzwFDg0PDRMMUA0PQx4YDhcaAFINFR0TBhxNChdIARcIGQ1BBgEbBhEHC15FAx0TQx8BGhBIARdFQUhSU19NBA5IX1IQHkgxAh0EHE4lBAAWFQENDwpNDg8EAABIAg0VDBofTwIeBBwRUAQEQwuuxgkNEBwAAkZBLw5NAwoPCxdFEUgOFhkIHRdIABxFQlhQUkE=",
      "piece": "~AAkT",
      "apres": {
        "commun": [
          {
            "qui": "systeme",
            "texte": "~JA0PFw4ZBhUNRRYAUBsAAQAZDgQNRRcLAg0GChwZHaDBAFxFMR0VBhofT1lIDBwGHwYPFkE="
          },
          {
            "qui": "zhang",
            "texte": "~OQYCDAEDGk1IJBAWHwQUDgoDG00="
          }
        ]
      },
      "duel": {
        "titre": "~NRAADgoDTwcNRQCm2RwEDRsEAA1IX1I1s8EKCgE=",
        "consigne": "~JBoOChxNHhYNFgYMHwYST08JBhtIFhcGHwYFBhxNDAsJBgcLFURBAAcMDBYGRQEQAkgSDAFNG6DBCbHMAAAODQpDTy8NRR8AGQQNBhofTxALCgAAUA8ABAEIQQ==",
        "quiz": [
          {
            "q": "~MwcMAQYIAUMMh/L8EQYIDg4YF0MbEABFHIrh+g4frMkcAFIBBUgVDAYZTwcNRR4EUDsADwMITwcNRR6H8PEpAh0AAA0BAFIWBRgToMUACkNX",
            "options": [
              "~SQ==",
              "~QVg=",
              "~Rw=="
            ],
            "bonne": "~QQ=="
          },
          {
            "q": "~NAkPEE8cGgwBRRcWBEgVAgYBA6DBRR4AUA8TAgEJTwEHEBYBGAlBBxpNGwYFFR4AUAwEEE8hDg4JFlJa",
            "options": [
              "~JQZBEAoYA0McFx0LE0gFBk8eDg0cBB4=",
              "~JQZBAQMCDEMMAFIPEQwE",
              "~NB1BAR0CARkNRRYKAqvI"
            ],
            "bonne": "~QA=="
          },
          {
            "q": "~MwcMDgoDG0MMDAZIHwZBocRNKBEJCxYAUCUUEQ4EAw8NRbDeUA0PQwwFBg0HDAFFTw==",
            "options": [
              "~N6vYBKrgAQQ=",
              "~JAGl4gEZrMIG",
              "~MwCiwgEKDAurzBwC"
            ],
            "bonne": "~Qg=="
          }
        ]
      }
    },
    {
      "id": "M08",
      "date": "2026-11-13",
      "acte": "Shanghai",
      "ville": "Suzhou",
      "lieu": "Jardins de Suzhou",
      "terrain": "deux",
      "type": "choix",
      "image": "jardin.svg",
      "commun": "~MRsSBhYIFU4eCgcWUBkUBgMcGgZIFRMXBEgFAgEeTxYGRRgEAgwIDUNNDAsJBgcLUAwEQxwCAUMLpsYRs8FPQyOP7/oBCwEVFQsVBhofTxUHEAFFs8ECEQYZTwYGRQIXGR6iykE=",
      "dj": "~KzIpIiEqrdRYVUJULUgxEQAdABABERsKHkgCDAELBgcNCwYMFQQNBkNNHaDBFhcXBqvIBk+uz0MeCgcWUBsEFgNDTyerzBwKHgsEGU8YAQZIDAAXs8EGFgMMHQocpttFFA1BD43t9gIdEQAAUAsADQsECwIcRVoLkuj4CgIdABEcAFIJERkUBgMBCk9ICRdFMh0TBg4YTw2K5esAAxxBEw4eTxENAhMXFAkPF0ZNChdIDxdFBgcUEE8MDAAHFxYAUFpBEwAEARcbS1I2GUgXDBoeTxUHEAFFFKvIDQADDAYSRQYKBRtBDwoeTwcNEApJUAIEQx0IGwoaAFJUUBgOCgEZT6DIRRENEQsUDUFnZTGrzAIKHgwSQxwIGg9ERQEEHhtBAAADHBYEERcXUASD4/YMGhcaAFxFNQYSFgYZCkMbAAcJFQUEDRtBTwcBERcWXR4OFhxNDAZIFAcAUB4OFhxNDhUNH1IGGAcIEAZD",
      "auv": "~KzIpIiEqrdRYVUJULUgxEQAdABABERsKHkgCDAELBgcNCwYMFQQNBkNNHaDBFhcXBqvIBk+uz0MeCgcWUBsEFgNDTyerzBwKHgsEGU8YAQZIDAAXs8EGFgMMHQocpttFFA1BD43t9gIdEQAAUAsADQsECwIcRVoLkuj4CgIdABEcAFIJERkUBgMBCk9ICRdFMh0TBg4YTw2K5esAAxxBEw4eTxENAhMXFAkPF0ZNChdIDxdFBgcUEE8MDAAHFxYAUFpBEwAEARcbS1I2GUgXDBoeTxUHEAFFFKvIDQADDAYSRQYKBRtBDwoeTwcNEApJUAIEQx0IGwoaAFJUUBgOCgEZT6DIRRENEQsUDUFnZTGrzAIKHgwSQxwIGg9ERQEEHhtBAAADHBYEERcXUASD4/YMGhcaAFxFNQYSFgYZCkMbAAcJFQUEDRtBTwcBERcWXR4OFhxNDAZIFAcAUB4OFhxNDhUNH1IGGAcIEAZD",
      "options": [
        "~Iw1BFw4EHQY=",
        "~NKvIDQADDAYa"
      ],
      "issues": {
        "0-0": {
          "messages": [
            {
              "qui": "zhang",
              "texte": "~MR0CFgEITwerzBwKHgsIAhsEAA1GRTGH8PEEEBtNC6DBBhcTEQYVTU8hCkMqEAAAER1BEx0IAQdICx0RFUgFBk8bABcaAFIJHxEAFhuuxk1IJAcGBQZBEwAEARdG"
            }
          ],
          "moi": 0,
          "autre": 0
        },
        "1-0": {
          "messages": [
            {
              "qui": "zhang",
              "texte": "~NKvIDQADDAoJERsKHkgEDR0ICAobEQCm2Q1PQ11NHwwBCwYWUBgOFh1NGQwdFlxFPA1BIRofCgIdRRMVABqiygwECkMEAFIGGR4IEAIIQQ=="
            }
          ],
          "moi": 2,
          "autre": 0
        },
        "0-1": {
          "messages": [
            {
              "qui": "zhang",
              "texte": "~PIrh+g4YGxENRREEHgwIBw4ZTxUHEAFFEUgFoMYDAA0LpttLUFpBEwAEARcbRQIKBRpBDxoEQUM4CgcXUB4OFhxBTxEBABxL"
            }
          ],
          "moi": 0,
          "autre": 2
        },
        "1-1": {
          "messages": [
            {
              "qui": "zhang",
              "texte": "~NKvIDQADDAoJERsKHhtBAB0CBhCrzBcWXkg0DU8dAAoGEVIBFUgMDAYDHEMLDRMGBQZPQyMITyEdFxcEBUgABwAfCkOrwhNL"
            }
          ],
          "moi": -1,
          "autre": -1
        }
      },
      "dossier": "~Mw1BEhoITxUHEAFFBg0PBhVNCwZIDx0QFRpBEI3t9gIYFRcJHA1BDwpNCwoEAB8IFUgFFk8dHQobChwLGQ0TT08LABEFBB4MA6vIQwoDT1JRUEJLUCQEEE8HDhEMDBwWUAwEQzwYFQsHEF5FFR0ZT08eAA0cRRQEGRwSQx8CGhFIFAeH8PEODU8DCkMeChsAUAIADg4EHEMcCgcRUAyD4/YYAUMLCgcVXkg0DQpNDAwYDBdFFIrh+hoDCkMLCgcXUAwUQwUMHQcBC1IBBUgsAqzDGxENRRYAA0gHCgMIGxBIBFIBkuj4AgYBAwYdFwFFs8EVoMZNBg0bERMJHKvIBk8MGkMlAAYXHxgODwYZDg1IKAcWFR0MQwsITy0NElI8HxoKQw4YTwerzBAQBEgFBhxNDg0GptsAA0hQWlddQQ==",
      "piece": "~BQY="
    },
    {
      "id": "M09",
      "date": "2026-11-14",
      "acte": "Shanghai",
      "ville": "Shanghai",
      "lieu": "Temple du Bouddha de jade",
      "terrain": "auv",
      "image": "jade.svg",
      "verrou": {
        "type": "gps",
        "lat": 31.241,
        "lon": 121.4453,
        "rayon": 500,
        "nom": "~HA1BFwoAHw8NRRYQUCoOFgsJBwJIARdFGgkFBg=="
      },
      "commun": "~NA0UG08PABYMARoEA0gFBk8HDgcNRRAJEQYCT08fDhMYCgARs8ESQx8MHUMdC1IIHwEPBk+uz0MEBFIDGQZBBxpNNyowAFIWGavJAAMIQUMhCQFFBgEEDQEIARdIARdFHAcIDUNNDhUNBlIJFR0TEE8dDhMBAAAWUA0PQx2uxwQEAFxFPA1BIRofCgIdRRNFEwkCC6zETw8NEABFABoOFQoDDg0LAFIBEQYSQxoDCkMPFxsJHA1P",
      "auv": "~IAcCCwAEHUMMEFInBRoEAhpNR4H/7lJYUBwTDBpBT4H+xVJYUBgNBgYDRkNSb3iH5OpBgfnNT0OK8vlFUIr3w09NjfTjRZDx8mKD9+1NjfTjRVKH5shBQ4365ENIh+TFUIr14WWP++FIh+TFUEiD9ORNT4H/7lJFkv7BQ4357WmK8fBFkv/qQ0+P+cNIRZDz0EhBgfjmT4H853hvPIrh+g4YGxENRREEHgwIBw4ZTwJIEBwAUA8TCgMBCkMMAFIJFRwVEQoeTwcNRR4EUAWiyQIITxcJDB4JFUZBJ6zEDBEBFl8JBQFBDKzUTxAHCwZFHA0SQxsfABYbSVIJGQ8PBk8dDhFICRsCHg1PQyMIHEMEAAYRAg0SQxwCGhBICRcWUBwTDBoeTwcHCxwAHhxBDwpNDAwMAFw=",
      "dj": "~NxoIDwMITwcNRREKHhwToNsBCkMMAAFFAg0NCh4YChBIX3hvkvzjQztNTyFIRT1FUCFBgfvvZYH851I3UEgyQ08gT0M9RZDx8mKD9+1NI0NIJFJFPkhBJE+P++Fih+bnUCFBQydNTyhIRTdFkvzjaWUhjePxBAcRAg1BAA4DCwoMBAZFEUgNBk8dAAAAChsXXkgtChxNAwYbRR4ABBwTBhxNHhaK5esMHEgVBk8JrMobDBULFURBBwpNCAIdBhoAUKvBQwsfAAocAF5FHAEGDQpNHwIaRR4MFwYETU8hCkMLChYAUA0SF08BCkMFCgZFHwoVBgEYQQ==",
      "joker": "~PA0SQxsfABYbRRYKHgYEDRtNLU4hSVI3XSVNQy5AIU9ILF8gXkgiDAsIT1lIJxsXHQkPCgpD",
      "dossier": "~PA1BDgAEAQZILQcMFw0PQw5NHQIYFR0XBKvIQwwEARJIBx0QFAwJAhxNCwZIJxsXHQkPCgpNCg1IVEpdQkgEF08IAUMJRR4EGRsSoMZNGxEHDAFFFQZBEQAYGwZGRT4AUBwEDh8BCkMJBgYQFQRBBw4ZCkMMAFJUSVpZTU89Cg0MBBwRUAQAQz2uxhUHCQcRGQcPQwwYAxcdFxcJHA1NQwMIHEMFChsLFRtBAhofDgoNCwZFABoOF6zECKDBRR4AA0gSFw4ZGgYbRRcLUBgNAgwMHQcJCwZFFA0SQx8CHRcaBBsRA0gFBk8gDgxIFgcXUAQEEE8dABEcAAFFSkgRBh0eAA0GAFILkuj4Ak8CHKDBRR4AA0gAER0MDAsNF1w=",
      "piece": "~ABoEDgYIHQ==",
      "duel": {
        "titre": "~MwAAEBwITwIdRUpdSA==",
        "consigne": "~NQZBIAcEAQZERR4AUFBBEwAfGwZIBx0LGA0UEU9XTwoERQEAUBgTDAECAQANRREKHQUEQ63GTwUJDAAAUA4OERsYAQZIp8lLUCyD4/YEDApICRdFFKvPDQofQ0MEAFIVAg0MCgofTxIdDFIVGAcVDAgfDhMADBdFSFBZQ6zEDBEBEVIUBQ0NEhoITxMJFwZFWBgTChdBTxMEBAMQFURBBgEeCgoPCxdJUAYUDqzEHQxIARdFBKvID6zEHwsHCxdMUA0VQwMITw4HCwYXFUiiw08BjePxBAcRAg1BBA4KAQZGRT4AA0iiygwfDg0bRRYAUB4OEE8dHQwYFxcWUByiygOuxhMAChwAA0gPBk8OAA4YERcLBEgRAhxD"
      },
      "apres": {
        "commun": [
          {
            "qui": "zhang",
            "texte": "~Og1BBwAEHEMeCgcWUAEPBQAfAgYaRRaH8PEUDQpNrMoeCh4QBAEODU8frMoPCRcIFQYVAgYfCk0="
          },
          {
            "qui": "zhang",
            "texte": "~MRgToMceTxWrzAAMFgECAhsEAA1ERR4AUA8TDBodCkMLCh8VBA1BFx0CBhBINRMQHEZBNQAYHEMMAAcdXEgEF08AAApG"
          },
          {
            "qui": "zhang",
            "texte": "~Oorh+g4ETwcHCxFFFKvIEwAerMpICBNFABoOEx0ITwAJCxYMFAkVFh0IQUMiAFIRGQ0PEE8AAA1IFQAKABoEQx0ICAobEQAAXkgrBk8eGgobRRcLUByiyRsIQQ=="
          },
          {
            "qui": "systeme",
            "texte": "~Ig0CDBofHEMYCgEWGQoNBk9XTxENCAIJGRpBBgEeCg4KCRdFHA1BBQAfAhYEBBsXFUgHCgEMA09IptJFMwAODQgcBg0PS1IwHkgHDB0AGg8JDAAAUA0ZAgwZTwIGCwcJFUgVDBoZCkMLBBwBGQwAFxofCkMOFxMQFB0NBhoeCk0="
          },
          {
            "qui": "zhang",
            "texte": "~OQRBDQpNHAYaBFIVERtBBhcMDBdG"
          }
        ]
      },
      "empreintes": [
        "bded3c4d66bd12c296281db25668b52095fd2ad4df5c0609d13a4f7ef2ec28c8",
        "9d0d332e0dfd331908f695b4f1dfe23d22aafdec7cfdf50da25ea8b1e331e641",
        "e69c0ebca53bcc8d5c20b1c3a7ac80d5f490f662f6f65e4d0db2f62b7e55b8bf",
        "3dcb7f8d07d2877858975be5df7d99bac3d26178d529b0926e4ab9e40fc41891"
      ]
    },
    {
      "id": "M10",
      "date": "2026-11-15",
      "acte": "Chongqing",
      "ville": "Chongqing",
      "lieu": "Station Liziba",
      "terrain": "dj",
      "image": "liziba.svg",
      "commun": "~JQYEQxkEAw8NRQYAHAQEDgoDG0MNC1IVFQYVBk8cGgZICRdFHavIFx0CTxcaBAQAAhsEQxoDTwoFCBcQEgQEQwuP7/oABBAMBAkVCgADQUMkAFInBRoEAhpNDkMLCRMWA6vIQwMITwcHFgEMFRpBocRNGhEKBBwMAwUEQwwfrMoJERsDUKraTQ==",
      "dj": "~s+hBLwYXBgEJSVIXFRiiyx0ITw8NRRwQHavIEQBNCwZICRNFHAEGDQpNHhYBRQYXER4EERwITw+K5esMHQUEFg0BCkNAFgcXUAQEEE8dDg0GABMQCEgFFk8ArMocFx1MXkglChxAAwZIptJFHIrh+g4YGxENRREEHgwIBw4ZQQ==",
      "auv": "~MRoCCwYbCkMMEFInBRoEAhpNVUMEh/L8GQUMBhoPAwZIBh0IABwEQ15UT6DBERMCFRtPQyMITwAHARdFFRsVQwMITw0dCLHMAgdBBwpNAwJICRsCHg1BEBoEGQpIARdFEw1BDQAADRENSVIWEQYSQwoeHwILAFw=",
      "joker": "~PAlBDwYKAQZIV1xFMwcFBk9XT1FZXFw=",
      "dossier": "~PAlBEBsMGwoHC1IpGRIIAQ5NAAALEAIAUBwTDAYeT6DBERMCFRtBB43t9hYGRRsIHQ0UAQMITwcNRUNcUKvIFw4KChBIX1IGHwYSFx0YBhENRR4EUA8AEQpNCwIGFlIJkuj4CgIAChYKCRdFEwei2BsMBhdICB0MHhtBAAcIHUMZEBdFFA1BDwpNHQIbAABLUCQEEE8uBwoGChsWUBsUEQECAg4NCwZFMwAODQgcBg0PRbDOUAQAQxkEAw8NRUohUKraTU8uBwYaBhoACkijyE8uBwwGAgMMHg9BWytNrdhERQQKBRtBAAAAHxENCxYXFRJP",
      "piece": "~AAkS",
      "duel": {
        "titre": "~s+EREQoYGQZIAQdFFg0U",
        "consigne": "~MR1BB6zDAQYaSVIGGAkCFgFNDBEHFAcAUB0PQwgfDgoGRRYAUBgOChkfCkMMEFI2GQsJFg4DT0uA78OD1PpNQwcYq+ICDLbkH0FBBgEZBgYaSVIKBUgNBk8AABELABMQUAwEQx8EAgYGEVIJFUgRDxoeTxEHEBUAUAwEQwMMTxcJBx4AXkgtBk8dHQYFDBcXUBkUCk8PAAocRR0QUBkUCk8eCkMYCRMMHhxBEwofC01IKRdFMh0TBg4YTxEJFQIAHAQEQx4YCkMEh/L8MR0XBh0KAQZIBFIBFRtBFQABDAIGFl5FHQkIEE+uxhcNDBwRA0ZBJwABBhMaBBwAUAYODU8LABYaCxtL"
      },
      "empreintes": [
        "0feb1743ffebe8f0b35d2639e92532bfd202e85ecc7d9611a309735dcbd9f228"
      ]
    },
    {
      "id": "M11",
      "date": "2026-11-16",
      "acte": "Chongqing",
      "ville": "Dazu",
      "lieu": "Sculptures de Baoding",
      "terrain": "auv",
      "image": "guanyin.svg",
      "commun": "~NAkPEE8BChBIAxMJEQESBhxNCwZIJxMKFAEPBENNGg0NRTUQEQYYCgFNCwwaptsAUAyiyh8BAAoNRQEAA0gDEQ4eTwYGRbHMBg0PFw4EA01IKhxFHIrh+g4dHwYECRdFHAlBJBoMARoBC1IEBRBBDgYBAwZICBMMHhtPQyoBAwZIC5Dl6Q0PQw5NHwIbRR8MHAQETU8hCkMqEAAAER1BAk8fCgAHCAIRs8FP",
      "auv": "~PA1BIRofCgIdRQAAAxsOERtNHAwGRQYKBRxBEx0IAgoNF1IDHxoMFgMMBhENSVIXs9wNBhxNBg0eAAAWs8ESTU85AA1IptsGAgkPQw4LCQoLDRdFQVhBEBYADQwEAAFJUA0PQwsIGhtICB0RA0ZBJ6zEDBEBFl8JFRtBoM9NA4Ho/BMQBBoEQwwMAQcBARMRUAwADRxNA4Ho/B0XFBoET08JCkMPBAcGGA1BoM9NCxEHDAYAXEgCCw4cGgZIEQAEGRxBBwpNBwIdEVIAHkgDAhxDZWmK8fOH5OmD9+6P++KK8fNFUIr14o357kOK8fOH5OlBQ4357oH85JDx8Yr14o357kNIh+bkkvzggfvsjffph+bkUEiD9+6P++JIh+bkkvzgaY357oH85JDx8Yr14o357kNIh+bkkvzgQ4357oH85FJFkvzggfvsT4H85JDx8UhBgfvsjffpRZDx8Yr14k9Njffph+bkkvzggfvsjffpb5Dx8Yr14o357oH85JDx8UhBgfvsjffph+bkkvzggfvsT0OK8fOH5OlBgfvsjffpRVKH5OmD9+5Njffph+bkUEiD9+6P++JIh+bkkvzgaWWP++KK8fOH5OmD9+6P++JIRZDx8Yr14o357oH85JDx8UhBgfvsjffpRZDx8Yr14k9Njffph+bkUIr14o357kNIh+bkkvzggfvsjffph+bkeor14o357oH85JDx8Yr14k9Njffph+bkkvzggfvsjffpRVKH5OmD9+5Njffph+bkUEiD9+6P++KK8fOH5OmD9+5NT4H85JDx8UiD9+6P++Jih+bkkvzggfvsjffph+bkUEiD9+6P++JIh+bkkvzgQ0+P++KK8fOH5OmD9+6P++JIRZDx8Yr14o357oH85JDx8UhBgfvsjffph+bkkvzggfvs",
      "dj": "~PIrh+g4YGxENRREEHgwIBw4ZTxUJRQYAUAyiygwfBhENRUNVUBsYDg0CAwYbSVIAHkgFBhoVTw4HEQFLUDwAQxsMDQ8NRRNFEwAADQiuxkMMAAIQGRtBDwpNHxENCBsAAkgHDB0AGg8JDAAAUFJBDQpNGwZIAxsAUBgAEE+uz0McBFIIs8EMDAYfCk1ib5Dx8Yr14o357oH85JDx8UhBQ4357oH85FKH5OmD9+5NT0OK8fOH5OmD9+6P++KK8fNFUEiD9+6P++JIh+bkkvzgaY357oH85FKH5OmD9+5NT0OK8fOH5OlBgfvsjffpRVJFkvzggfvsT4H85JDx8UhBQ4357oH85JDx8Yr14o357mmK8fOH5OmD9+6P++KK8fNFUEiD9+6P++JIh+bkkvzgQ09Njffph+bkUIr14o357kNIRZDx8Yr14o357oH85JDx8WJBQzxNT0NIRVJFP0hBQ09NT0MkRVJFUEhBQyFNT2lih+bkkvzgQ4357oH85FJFUIr14o357oH85JDx8Yr14k9NT4H85JDx8Yr14o357oH85FJFUIr14o357kOK8fOH5Olrgfvsjffph+bkkvzggfvsT0NIh+bkkvzggfvsjffph+bkUEhBgfvsjffph+bkkvzggfvsT0NIh+bkkvzgQ4357oH85HiH5OmD9+5Njffph+bkUEhBgfvsjffph+bkkvzggfvsT0NIh+bkkvzgQ4357oH85FJFUIr14o357oH85JDx8Yr14mVNTyZIRVJFUEhBLk9NT0NIRVIkUEhBQ09NTypIRQ==",
      "joker": "~PA1BAAAJCkMNFgZFPSEtLypNIiIhKyFLUCQEQy0YHQYJEF5FHB0IT08IAUMJRREKHRgVoMZNV1BYSw==",
      "dossier": "~IA0PBw4DG0MEBFIXFRsVAhofDhcBChxJUAwEQ11dX1tIptJFQlhQVkNNAwZIJwcXFQkUQw5NDAwFFQam2UhZUF9NAgIBCwFJUBgAEE8ABg8EAFxFMwAAEhoITw4JDBxFEUiiyhuuxkMGEB+m2RoOF6zECk9IAAZFHAlBEwMYHwIaEVIVHxoVBgEZTxYGRbf2GQRBBw4DHEMEBFIVER0MBkFNPApIEx0QA0gXDBoeTxANCwYACkgOARwIHRWrzAFJUAuD4/YIHBdICx0XHQkNQ1VNDIHo/BcWBEgNBk8vGhENBAdL",
      "pieceTexte": "~leXiiujhi9rjjdPpn9Tthsjmi9nmjcTWlNDqQ1VNAwJIFRoXERsEQx4YCkMOCgAIFQYVQxkCHEMHCwgAUAUOFxxBTwcJCwFFAwlBDw4DCBYNRRaH8PEOEQYKBg0NS1IgHAQEQwoeG0MMAFIpEQcbCkE=",
      "duel": {
        "titre": "~NRAADgoDTwcNRQCm2RwEDRsEAA1IX1I2GAkPBAcMBkMNEVImGAcPBB4EAQQ=",
        "consigne": "~NA0TDQYIHUMNHRMIFQZPQzsfAAobRQMQFRsVCgADHE9IARsdUBsEAAADCwYbRRENEQsUDQpBTwAABBEQHkgSFh1NHAwGRQam2QSiyh8FAA0NSw==",
        "quiz": [
          {
            "q": "~NIrh+gCu1kMeDBcLHg0PF08BChBIBx0QFAwJAhxNCwZIDxMBFUgFBk8+BwIGAhoEGUhe",
            "options": [
              "~NB1BNwYPChc=",
              "~NIrh+iYDCwY=",
              "~NA1BIQYfAgIGDBc="
            ],
            "bonne": "~Qg=="
          },
          {
            "q": "~IR0EQxkIGhdIARsXFUiF2+WL2tRERSENEQYGCw4ET1w=",
            "options": [
              "~Ix0TQwMMTw4NFw==",
              "~IAcTFwpNCwZICZDl6S0SFw==",
              "~JgENDwpNCxZIAx4ABR4E"
            ],
            "bonne": "~QA=="
          },
          {
            "q": "~IR0EDwMITw8BAhwAUAwEQwKuxhcaClIRAgkXBh0eCkMEh/L8GQUMBhoPAwZIARdFPAEbCg0MT1w=",
            "options": [
              "~PAlBUA==",
              "~PAlBUQ==",
              "~PAlBVA=="
            ],
            "bonne": "~QQ=="
          }
        ]
      },
      "empreintes": [
        "b0ff6f36c520917d5ade4296c70170a7e29ee7d7bfce354ef2051e3438d4855f"
      ]
    },
    {
      "id": "M12",
      "date": "2026-11-16",
      "acte": "Chongqing",
      "ville": "Chongqing",
      "lieu": "Audience finale",
      "terrain": "deux",
      "type": "final",
      "image": "croisiere.svg",
      "commun": "~MxoOChwErMsaAFIBFUgPFgYZQUMrDR0LFxkIDQhNChAcRRym2Q1BAhpNDAwGAx4QFQYVQwsITwcNEApFFgQEFhkIHE9ICRdFKQkPBBserMpIAAZFHA1BKQYMAwoGAlxFMw1BEAAEHU9ICRdFMh0TBg4YTxENCxZFAwcPQxkIHQcBBgZLUCUAChxNC4Ho/BMHHxoFT08BCkMOCgAIBQQACh0ITwUBCxMJUFJBD43t9gIaERsGHA1BUk8JGkMaptoCHA0MBgEZQ0MaABEKHhsVChsYrMpIptJFAAkTFwYfTwcNRQQKA0gODRUITw4HEQFL",
      "dj": "~JAkRBhVNA4Ho/BMXBAECDwpNXkMNC1IAHhwIBh1BTw4HEVIVHx0TQwICG01IMx0WUAUOFxxNHAwGEVIBEQYSQxkCGxENRRYKAxsIBh1BTwYGRRAEA0gFBk8dDgQNSw==",
      "auv": "~JAkRBhVNA4Ho/BMXBAECDwpNXkMNC1IAHhwIBh1BTw4HEVIVHx0TQwICG01IMx0WUAUOFxxNHAwGEVIBEQYSQxkCGxENRRYKAxsIBh1BTwYGRRAEA0gFBk8dDgQNSw==",
      "joker": "~M4rh+goeG0MdC1IVAgcXBh0PCkMMAFIpEQcbCk9XT6HDRScLUB4OGg4KCkMMAFIIGQQNBk8BBgYdAAFFEwcMDgoDDAZIER0QGgcUERxNHwIaRQcLUBgTBgIEChFIFRMWXkij2A==",
      "dossier": "~MR1BAAADCQ8dABwRXEgODU8bAAocRQEKBR4EDRtNAwJIAwAKHhwIoMcfCkMNCwYXFUgNBhxNCwYdHVIAER0ZQ1VNAwZILxsEHAEPBE8dAxYbRREJEQETT08BCkMxBBwCBBuiyk8dAxYbRRAKBQ0UG0FNKwYdHVIGHx0TAgEZHEMZEBtFFgEPChweCg0cRQIEAkgPge/0Cg1IAxMMAg1BEhqP7/odC1xFIAkSQwwITxAHDABL",
      "apres": {
        "commun": [
          {
            "qui": "systeme",
            "texte": "~NgcTDhoBDgoaAFIDGQYAD08IFwILEVw="
          },
          {
            "qui": "systeme",
            "texte": "~MwkPBwYJDhcdFxdFFA1BLkFNNQsJCxVFMq/vDAMYrNBIX1IEHgYUD6zECkMYCgcXUA4TAhoJCk0="
          },
          {
            "qui": "zhang",
            "texte": "~kujH"
          },
          {
            "qui": "zhang",
            "texte": "~JBqiyxxNDQoNC1xFOg1BEQoJChUBABwWUAEPEB8IDBcNEABLUDgTDAyuxgcHCwFFER1BAB0CBhANCBcLBEgFBhxNHQYPDAERAg0STQ=="
          }
        ]
      },
      "verdict": {
        "consigne": "~MwAAEhoITxerzB6m2RgJDAEITwJIERcLBUgSDAFNHxEHFQAAUBoEBAYeGxENS1IkHgYODQwIFU4eCgcWUB4OEE8OAAcNFlIBFUgTBggEHBcaAFKm0EgXDAYVTwsJEAYAXEgEF08ZDhMNRREAHB0IQwsITw+K5esEBRwTBk8ODg0MDBYEBEZBMI3t9goEFlIGHwYCDB0JCg0cSVIJFUgXBh0JBgAcRQYKHQoETQ==",
        "discordance": "~Ig0GChwZHQYbRRYMAwsOEQsMARcbS1IpFUgjFh0IDhZIFh0QAKvGDAEDCkMdCxdFFhoAFgsIQUMrCh8VERoEGU8bABBIFxcCGRsVEQoeTw8BAhwAUBgAEU8BBgQGAF5FAg0CFwYLBgYSRREAUBkUCk8JAAocRR6H8PGiyRsfCk9IFQcMA0iiygwFDg0PAAhFFA1BDQAYGQYJEFITHxtBAAAJChBG",
        "departage": {
          "titre": "~s+EREQoYGQZIARdFFKvIEw4fGwIPAA==",
          "consigne": "~s+EGAgMEG6DBRQIEAg4AChsIQUMhCxMGEw0RFw4PAwZGRSIMFRoTBkILChYBCR4AXQsIEAoMGhtIABxFEwAIDQAEHENAFhqm3RwOFkNNBQqv6xwBtOkOT08PrNpBSVIQHg1BEAoYAwZICBMLEwAETU8hCkMqEAAAER1BDQpNGQYdEVIVHB0SQxkCGhBIEx0MAkY="
        },
        "annonce": [
          {
            "qui": "zhang",
            "texte": "~PA1BIRofCgIdRREAHhwTAgNNCwYbRRoKHQcPGgIIHEMJRRam2QQIAazEHaDBSw=="
          },
          {
            "qui": "zhang",
            "texte": "~OQRBDY3t9hpIBAcXEUgRDxoeTwkJCBMMA0gFBhoVTzMJEB5LUCENQxZNDkMdC1I1ER0NQwGv31JGRTcRUAENQxZNDkMEh/L8ER0VEQpD"
          }
        ],
        "certificat": "~PA1BIRofCgIdRREAHhwTAgNNCwYbRRoKHQcPGgIIHEMLAAARGQ4IBkNNrMNIERsRAg1BB6zECQoGDAYMFkgEF08eDg0bRRMVAA0NT08cGgY="
      },
      "empreintes": [
        "86b92f1af2029e72315a77880d350b124db990a607d30b0f647747a12d8eca65",
        "40fa528ae506e94c9e2fd8641b7fd3ff78dc46bcd3f2b12c529382d71b4c3ee6"
      ]
    }
  ]
};
