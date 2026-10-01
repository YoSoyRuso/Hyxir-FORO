/* ============================================================
   VERDAD AI — CASES DATA
   Todos los personajes, lugares, teléfonos y eventos son
   FICTICIOS. Los teléfonos usan el rango 555 reservado para
   ficción. No se realiza ninguna llamada real.
   ============================================================ */

window.CASES = [
  {
    caseId: "CASE_001",
    prediction: 43,
    title: "The 43 Signal",

    /* ---------------- PERSONAS ---------------- */
    characters: [
      {
        id: "marcus_hale",
        name: "Marcus Hale",
        age: 31,
        role: "MISSING PERSON",
        lastLocation: "Motel Blackwood — Distrito 7",
        status: "UNKNOWN",
        publicRecord: "Born 1994. Last known employment: night auditor. No criminal record.",
        notes: "Reported missing on October 18. Last seen entering Motel Blackwood the previous night."
      },
      {
        id: "marta_hale",
        name: "Marta Hale",
        age: 36,
        role: "WITNESS (sister)",
        lastLocation: "District 7",
        status: "COOPERATING",
        publicRecord: "Filed the missing person report.",
        notes: "Claims her brother called her at 23:47 the night he disappeared. Call lasted 12 seconds."
      },
      {
        id: "det_kowalski",
        name: "Detective A. Kowalski",
        age: 48,
        role: "INVESTIGATOR",
        lastLocation: "District 7 precinct",
        status: "ACTIVE",
        publicRecord: "Assigned to the Hale case.",
        notes: "Wrote a memo flagging the case as 'unusual'."
      },
      {
        id: "porter_vega",
        name: "R. Vega",
        age: 27,
        role: "MOTEL PORTER",
        lastLocation: "Motel Blackwood",
        status: "UNKNOWN",
        publicRecord: "Employed at Motel Blackwood since 2022.",
        notes: "On duty the night of October 17. Never showed up to work again."
      }
    ],

    /* ---------------- LUGARES ---------------- */
    locations: [
      { id: "motel_blackwood", name: "Motel Blackwood", district: 7, notes: "Closed since the 1998 fire. Reopened 2021." },
      { id: "room_43",         name: "Room 43",         district: 7, notes: "Corner room, second floor. Locked from inside." },
      { id: "district_7",      name: "District 7",      district: 7, notes: "Industrial/residential boundary." }
    ],

    /* ---------------- DOCUMENTOS ---------------- */
    documents: {
      "ARCHIVE-043": {
        title: "ARCHIVE-043",
        public: true,
        body:
`ARCHIVE ENTRY 043
----------------------------------------
FILED: 1998-10-17
STATUS: PARTIALLY REDACTED

On the night of October 17, 1998, a fire broke out
inside Motel Blackwood, District 7.

Casualties: ██████
Cause: UNDETERMINED
Investigation: CLOSED 1999-02-11

Note: A second file, CROSS-REF-43, references the
same date. It is stored in files.net.
----------------------------------------
KEYWORD: Blackwood`
      },

      "CROSS-REF-43": {
        title: "CROSS-REF-43",
        public: false,
        password: "BLACKWOOD17",
        body:
`CROSS-REFERENCE 43
----------------------------------------
Linked events:

  1998-10-17  Fire at Motel Blackwood
  2019-10-17  Disappearance (case never filed)
  2026-10-17  Marcus Hale enters Room 43
  2026-10-18  Marcus Hale reported missing

Note:
  All three events share date 10-17.
  All three involve the same building.

  A pattern is not a coincidence.

  If you are reading this and something is wrong,
  call the number below. Only once.

  PHONE: 555-0143
----------------------------------------`
      },

      "MEMO-KOWALSKI": {
        title: "MEMO-KOWALSKI",
        public: true,
        body:
`INTERNAL MEMO
FROM: Det. A. Kowalski
TO:   Case review board

Subject: Hale, Marcus — CASE 2026-1018

I have reviewed the file three times.
Something does not add up.

The call from Marcus to his sister lasted 12 seconds.
The transcript says only two words were spoken.

  "Room 43."

Then nothing.

The motel's CCTV shows him entering Room 43.
It does not show him leaving.

The door was locked from the inside.

We have no body, no suspect, and no explanation.

Recommend: keep the case open.`
      }
    },

    /* ---------------- NOTICIAS ---------------- */
    news: [
      {
        id: "news_1",
        date: "1998-10-18",
        headline: "Fire consumes Motel Blackwood, District 7",
        body: "A fire broke out late Friday night at the Motel Blackwood. Investigators have not yet determined the cause. Several guests remain unaccounted for."
      },
      {
        id: "news_2",
        date: "2026-10-18",
        headline: "Local man reported missing after visiting abandoned motel",
        body: "Marcus Hale, 31, was reported missing by his sister on Sunday morning. He was last seen entering the former Motel Blackwood, which reopened in 2021 as a long-term residence."
      },
      {
        id: "news_3",
        date: "2026-10-19",
        headline: "Motel porter fails to appear for shift",
        body: "The night porter of the Motel Blackwood did not show up for his shift on Sunday. Police have not connected this to the disappearance of Marcus Hale."
      }
    ],

    /* ---------------- FORO ---------------- */
    forum: [
      {
        id: "f1",
        user: "nightowl_77",
        date: "2026-10-19",
        title: "Blackwood motel — anyone else notice the smell?",
        body: "I walk past that place every night. Since Sunday there's a weird smell coming from the second floor. Corner room. Anyone know what room that is?"
      },
      {
        id: "f2",
        user: "ex_resident",
        date: "2026-10-20",
        title: "Re: Blackwood motel — anyone else notice the smell?",
        body: "That's Room 43. It's been locked since I lived there. Nobody goes in. Not even the porter."
      },
      {
        id: "f3",
        user: "skeptic_99",
        date: "2026-10-20",
        title: "Re: Blackwood motel — anyone else notice the smell?",
        body: "It's obviously the porter. He's the one who ran away. Case closed."
      },
      {
        id: "f4",
        user: "nightowl_77",
        date: "2026-10-21",
        title: "Room 43 password?",
        body: "Someone left a note in the lobby referencing a file. Says the password is the motel name + the year of the fire. Tried 'blackwood1998' but the file portal wants it in caps and no space."
      }
    ],

    /* ---------------- RADIO ---------------- */
    radio: [
      {
        id: "r1",
        label: "DISPATCH-1017-A",
        transcript:
`[00:00] DISPATCH: Unit 12, respond to Motel Blackwood, second floor.
[00:03] UNIT 12: Copy. Approaching corner room.
[00:11] UNIT 12: Door is locked from the inside.
[00:18] DISPATCH: Copy. Do not force entry until backup arrives.
[00:27] UNIT 12: Copy.
[00:31] [inaudible]
[00:34] [end of transmission]`
      },
      {
        id: "r2",
        label: "CALL-1017-2347",
        transcript:
`[23:47:02] MARCUS: Marta.
[23:47:05] MARTA: Marcus? Where are you?
[23:47:07] MARCUS: Room 43. Blackwood.
[23:47:11] MARTA: Marcus, what's happening?
[23:47:14] [call ends]`
      }
    ],

    /* ---------------- PISTAS FALSAS ---------------- */
    redHerrings: [
      {
        id: "red_1943",
        text: "43 could be a year: 1943. archive.net has documents from that year about an unrelated fire.",
        resolvesTo: "archive_doc_1943"
      },
      {
        id: "red_porter",
        text: "The porter (Vega) ran away after the disappearance. This looks suspicious but he is also a victim.",
        resolvesTo: "forum_f3"
      }
    ],

    /* ---------------- FINAL ---------------- */
    finalPhone: "555-0143",
    solutionSummary:
      "43 is not a year, a page, or a person. It is a room number: Room 43 of the Motel Blackwood. Every 17 of October for decades, something has happened in that room. Marcus Hale was the latest. The phone in the final document connects the player to the last call Marcus made.",

    /* ---------------- RESPUESTAS DE VERDAD ---------------- */
    /* La IA compara la pregunta del jugador contra patrones y
       devuelve respuestas crípticas pero informativas. */
    aiResponses: [
      { match: ["what is 43","what does 43 mean","why 43","meaning"],
        reply: "43 is not a number. It is a location." },
      { match: ["is 43 a person","is 43 someone","who is 43"],
        reply: "Not directly." },
      { match: ["is 43 a year","1943","date"],
        reply: "The year is a coincidence. The date is not." },
      { match: ["is someone in danger","danger","help","victim"],
        reply: "QUERY ACCEPTED." },
      { match: ["who is in danger","who","name"],
        reply: "43." },
      { match: ["where","location","place","room"],
        reply: "Where the fire started. Where the door locked from inside." },
      { match: ["marcus","hale"],
        reply: "He spoke two words. Then silence." },
      { match: ["blackwood","motel"],
        reply: "The building remembers." },
      { match: ["october","17","17th","date"],
        reply: "Every year, the same date. Ask why." },
      { match: ["phone","call","number"],
        reply: "One number. One call. Choose carefully." },
      { match: ["password","key","code"],
        reply: "A place, a year, no space, all caps." },
      { match: ["marta","sister"],
        reply: "She heard his voice last." },
      { match: ["porter","vega"],
        reply: "He ran because he saw. Not because he did." }
    ],
    aiFallbacks: [
      "REQUEST DENIED.",
      "NOT ENOUGH DATA.",
      "ASK A BETTER QUESTION.",
      "THE ANSWER IS IN THE NETWORK.",
      "43.",
      "..."
    ]
  }
];
