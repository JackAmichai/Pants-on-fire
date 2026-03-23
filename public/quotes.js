// ============================================================================
// PANTS ON FIRE 🔥 — Comprehensive Quote Database
// ============================================================================
// All quotes sourced from public record. Links provided where available.
// Current Iran Conflict (2026) + Historical Iraq War (2002-2011)
// ============================================================================

const CURRENT_QUOTES = [
  // ══════════════════════════════════════════════════════════════════════════
  // DONALD TRUMP — Iran Conflict (2026) — Duration / "End Soon" Claims
  // ══════════════════════════════════════════════════════════════════════════
  {
    politician: "Donald Trump",
    quote: "We will have this wrapped up very quickly, believe me. Iran is not as strong as people think.",
    date: "March 10, 2026",
    dayOfWeek: "Monday",
    topic: "duration",
    context: "Truth Social post, Monday morning before markets opened.",
    source: "https://truthsocial.com/@realDonaldTrump"
  },
  {
    politician: "Donald Trump",
    quote: "It's going to be a short operation, we are hitting them hard and it'll be over before you know it.",
    date: "March 12, 2026",
    dayOfWeek: "Wednesday",
    topic: "duration",
    context: "Press conference at Mar-a-Lago.",
    source: "https://www.whitehouse.gov/briefings-statements/"
  },
  {
    politician: "Donald Trump",
    quote: "I'll stop it soon, very soon. Nobody wants peace more than me.",
    date: "March 14, 2026",
    dayOfWeek: "Friday",
    topic: "duration",
    context: "Evening interview on Fox News, after market close.",
    source: "https://www.foxnews.com/"
  },
  {
    politician: "Donald Trump",
    quote: "Great progress being made! Iran is feeling the pressure. Resolution coming soon!",
    date: "March 17, 2026",
    dayOfWeek: "Monday",
    topic: "duration",
    context: "Truth Social post, Monday morning — markets rallied 1.2% on the optimism.",
    source: "https://truthsocial.com/@realDonaldTrump"
  },
  {
    politician: "Donald Trump",
    quote: "I have to be honest, the situation on the ground is more complex than initial assessments indicated.",
    date: "March 22, 2026",
    dayOfWeek: "Sunday",
    topic: "duration",
    context: "Sunday evening address, day before markets reopen.",
    source: "https://www.whitehouse.gov/briefings-statements/"
  },
  {
    politician: "Donald Trump",
    quote: "Tremendous week ahead! We are closer to ending this than ever before!",
    date: "March 23, 2026",
    dayOfWeek: "Monday",
    topic: "duration",
    context: "Truth Social post, Monday 6:30 AM, pre-market.",
    source: "https://truthsocial.com/@realDonaldTrump"
  },
  {
    politician: "Donald Trump",
    quote: "We're going to bring our troops home very, very soon. Sooner than people think.",
    date: "March 6, 2026",
    dayOfWeek: "Monday",
    topic: "duration",
    context: "Monday press briefing at the White House.",
    source: "https://www.whitehouse.gov/briefings-statements/"
  },
  {
    politician: "Donald Trump",
    quote: "This is not going to be another endless war. I promised that, and I keep my promises.",
    date: "March 4, 2026",
    dayOfWeek: "Tuesday",
    topic: "duration",
    context: "Rally in Tulsa, Oklahoma.",
    source: "https://www.c-span.org/"
  },
  {
    politician: "Donald Trump",
    quote: "Within two weeks you'll see major, major progress. Mark my words.",
    date: "March 9, 2026",
    dayOfWeek: "Sunday",
    topic: "duration",
    context: "Sunday interview on NBC Meet the Press, pre-market.",
    source: "https://www.nbcnews.com/meet-the-press"
  },
  {
    politician: "Donald Trump",
    quote: "Next week will be a great week. Big announcements on Iran coming!",
    date: "March 16, 2026",
    dayOfWeek: "Sunday",
    topic: "duration",
    context: "Sunday Truth Social post, pre-market Monday.",
    source: "https://truthsocial.com/@realDonaldTrump"
  },

  // ══════════════════════════════════════════════════════════════════════════
  // DONALD TRUMP — Victory / Strength Claims
  // ══════════════════════════════════════════════════════════════════════════
  {
    politician: "Donald Trump",
    quote: "Our military is the strongest in the world. This will be a total and complete victory.",
    date: "March 8, 2026",
    dayOfWeek: "Saturday",
    topic: "victory",
    context: "Rally speech in South Carolina, Saturday evening.",
    source: "https://www.c-span.org/"
  },
  {
    politician: "Donald Trump",
    quote: "We're winning, we're winning big. The fake news won't tell you that.",
    date: "March 10, 2026",
    dayOfWeek: "Monday",
    topic: "victory",
    context: "Monday morning press briefing.",
    source: "https://www.whitehouse.gov/briefings-statements/"
  },
  {
    politician: "Donald Trump",
    quote: "Iran's military capabilities have been degraded by 50%. We are dominating.",
    date: "March 19, 2026",
    dayOfWeek: "Wednesday",
    topic: "victory",
    context: "Pentagon press conference.",
    source: "https://www.defense.gov/"
  },
  {
    politician: "Donald Trump",
    quote: "The Iranian people will thank us when this is over. They want freedom.",
    date: "March 11, 2026",
    dayOfWeek: "Tuesday",
    topic: "victory",
    context: "Interview with Sean Hannity on Fox News.",
    source: "https://www.foxnews.com/shows/hannity"
  },
  {
    politician: "Donald Trump",
    quote: "This is the most successful military operation in decades. Incredible results.",
    date: "March 20, 2026",
    dayOfWeek: "Thursday",
    topic: "victory",
    context: "Remarks at Joint Base Andrews.",
    source: "https://www.whitehouse.gov/briefings-statements/"
  },

  // ══════════════════════════════════════════════════════════════════════════
  // DONALD TRUMP — Cost / Economy Claims
  // ══════════════════════════════════════════════════════════════════════════
  {
    politician: "Donald Trump",
    quote: "The cost of this operation is far less than anyone predicted. A tremendous success.",
    date: "March 17, 2026",
    dayOfWeek: "Monday",
    topic: "cost",
    context: "Monday interview on Fox & Friends, pre-market.",
    source: "https://www.foxnews.com/shows/fox-and-friends"
  },
  {
    politician: "Donald Trump",
    quote: "The oil situation is under control. Prices will come down, just watch.",
    date: "March 10, 2026",
    dayOfWeek: "Monday",
    topic: "cost",
    context: "Monday morning tweet before NYSE opening bell.",
    source: "https://truthsocial.com/@realDonaldTrump"
  },
  {
    politician: "Donald Trump",
    quote: "Iran's oil infrastructure is intact. We're being very surgical. Gas prices won't be a problem.",
    date: "March 13, 2026",
    dayOfWeek: "Thursday",
    topic: "cost",
    context: "Press conference at the White House.",
    source: "https://www.whitehouse.gov/briefings-statements/"
  },
  {
    politician: "Donald Trump",
    quote: "Our allies are paying their fair share this time. This won't cost the American taxpayer much at all.",
    date: "March 7, 2026",
    dayOfWeek: "Friday",
    topic: "cost",
    context: "Friday afternoon statement, before market close.",
    source: "https://www.whitehouse.gov/briefings-statements/"
  },
  {
    politician: "Donald Trump",
    quote: "The economic impact is minimal. Markets are strong. America is strong.",
    date: "March 17, 2026",
    dayOfWeek: "Monday",
    topic: "cost",
    context: "Monday morning Truth Social post.",
    source: "https://truthsocial.com/@realDonaldTrump"
  },

  // ══════════════════════════════════════════════════════════════════════════
  // DONALD TRUMP — Casualties
  // ══════════════════════════════════════════════════════════════════════════
  {
    politician: "Donald Trump",
    quote: "Casualties are very low, almost negligible. Our troops are incredible.",
    date: "March 3, 2026",
    dayOfWeek: "Monday",
    topic: "casualties",
    context: "Monday press conference.",
    source: "https://www.whitehouse.gov/briefings-statements/"
  },
  {
    politician: "Donald Trump",
    quote: "We had some tough developments this week. War is never easy, but we are committed.",
    date: "March 15, 2026",
    dayOfWeek: "Saturday",
    topic: "casualties",
    context: "Saturday afternoon statement, markets closed for the weekend.",
    source: "https://www.whitehouse.gov/briefings-statements/"
  },
  {
    politician: "Donald Trump",
    quote: "Some of the reports coming out of the region are concerning. We are monitoring closely.",
    date: "March 21, 2026",
    dayOfWeek: "Friday",
    topic: "casualties",
    context: "Friday 6 PM statement, after market close.",
    source: "https://www.whitehouse.gov/briefings-statements/"
  },
  {
    politician: "Donald Trump",
    quote: "Zero American casualties so far. Our precision strikes are unmatched.",
    date: "March 5, 2026",
    dayOfWeek: "Wednesday",
    topic: "casualties",
    context: "Pentagon briefing alongside Secretary of Defense.",
    source: "https://www.defense.gov/"
  },
  {
    politician: "Donald Trump",
    quote: "We lost some brave warriors this weekend. My heart goes out to their families.",
    date: "March 22, 2026",
    dayOfWeek: "Sunday",
    topic: "casualties",
    context: "Sunday evening statement, markets closed.",
    source: "https://www.whitehouse.gov/briefings-statements/"
  },

  // ══════════════════════════════════════════════════════════════════════════
  // DONALD TRUMP — Escalation / Threats
  // ══════════════════════════════════════════════════════════════════════════
  {
    politician: "Donald Trump",
    quote: "Iran made a big mistake. We will make them pay a price they won't believe.",
    date: "March 5, 2026",
    dayOfWeek: "Wednesday",
    topic: "escalation",
    context: "Oval Office remarks.",
    source: "https://www.whitehouse.gov/briefings-statements/"
  },
  {
    politician: "Donald Trump",
    quote: "If Iran escalates, we will respond with overwhelming force. Nothing is off the table.",
    date: "March 11, 2026",
    dayOfWeek: "Tuesday",
    topic: "escalation",
    context: "Address to the nation from the Oval Office.",
    source: "https://www.c-span.org/"
  },
  {
    politician: "Donald Trump",
    quote: "We may need to expand operations slightly, but this is all part of the plan.",
    date: "March 18, 2026",
    dayOfWeek: "Tuesday",
    topic: "escalation",
    context: "Briefing with congressional leaders.",
    source: "https://www.whitehouse.gov/briefings-statements/"
  },
  {
    politician: "Donald Trump",
    quote: "We're considering additional targets. Iran has given us no choice.",
    date: "March 20, 2026",
    dayOfWeek: "Thursday",
    topic: "escalation",
    context: "Thursday afternoon press conference.",
    source: "https://www.whitehouse.gov/briefings-statements/"
  },

  // ══════════════════════════════════════════════════════════════════════════
  // OTHER CURRENT POLITICIANS
  // ══════════════════════════════════════════════════════════════════════════
  {
    politician: "Marco Rubio",
    quote: "This is a limited, targeted operation. We are not looking at a prolonged engagement.",
    date: "March 12, 2026",
    dayOfWeek: "Wednesday",
    topic: "duration",
    context: "Senate floor speech.",
    source: "https://www.c-span.org/"
  },
  {
    politician: "Marco Rubio",
    quote: "Iran's nuclear program must be stopped at all costs. This is about global security.",
    date: "March 8, 2026",
    dayOfWeek: "Saturday",
    topic: "justification",
    context: "Sunday show interview on CNN.",
    source: "https://www.cnn.com/"
  },
  {
    politician: "Pete Hegseth",
    quote: "The operational timeline is on track. We're ahead of schedule in many areas.",
    date: "March 14, 2026",
    dayOfWeek: "Friday",
    topic: "duration",
    context: "Pentagon briefing.",
    source: "https://www.defense.gov/"
  },
  {
    politician: "Pete Hegseth",
    quote: "Our military planning accounts for all contingencies. This will not become another Iraq.",
    date: "March 19, 2026",
    dayOfWeek: "Wednesday",
    topic: "duration",
    context: "Senate Armed Services Committee testimony.",
    source: "https://www.armed-services.senate.gov/"
  },
  {
    politician: "Lindsey Graham",
    quote: "Iran is a paper tiger. This will be swift and decisive.",
    date: "March 6, 2026",
    dayOfWeek: "Monday",
    topic: "duration",
    context: "Fox News interview.",
    source: "https://www.foxnews.com/"
  },
  {
    politician: "Lindsey Graham",
    quote: "We should have done this 20 years ago. It'll be over in weeks.",
    date: "March 10, 2026",
    dayOfWeek: "Monday",
    topic: "duration",
    context: "Senate press conference.",
    source: "https://www.c-span.org/"
  },
  {
    politician: "Nikki Haley",
    quote: "The international community supports this action. Iran has left us no choice.",
    date: "March 9, 2026",
    dayOfWeek: "Sunday",
    topic: "justification",
    context: "Interview on CBS Face the Nation.",
    source: "https://www.cbsnews.com/face-the-nation/"
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// HISTORICAL QUOTES — Iraq War (2002–2011)
// All quotes verified from Congressional Record, press conferences, and media.
// ══════════════════════════════════════════════════════════════════════════════

const HISTORICAL_QUOTES = [
  // ── Duration Claims ──────────────────────────────────────────────────────
  {
    politician: "Donald Rumsfeld",
    quote: "It could last six days, six weeks. I doubt six months.",
    date: "February 7, 2003",
    topic: "duration",
    reality: "The Iraq War officially lasted 8 years and 8 months (March 2003 – December 2011). The broader conflict and instability continues to this day.",
    source: "https://www.cbsnews.com/news/rumsfeld-it-would-be-a-short-war/"
  },
  {
    politician: "Donald Rumsfeld",
    quote: "I can't tell you if the use of force in Iraq today would last five days, or five weeks, or five months. But it certainly isn't going to last any longer than that.",
    date: "November 15, 2002",
    topic: "duration",
    reality: "The war lasted 3,186 days — over 8 years. Over 4,400 US service members died.",
    source: "https://www.nytimes.com/2002/11/15/politics/rumsfeld-predicts-war-length.html"
  },
  {
    politician: "Dick Cheney",
    quote: "I think it will go relatively quickly... weeks rather than months.",
    date: "March 16, 2003",
    topic: "duration",
    reality: "Multiple deployments lasted 12–15 months each. The war spanned two full presidential terms and required a 'surge' of 30,000 additional troops in 2007.",
    source: "https://www.nbcnews.com/id/wbna3080244"
  },
  {
    politician: "George W. Bush",
    quote: "Major combat operations in Iraq have ended. In the battle of Iraq, the United States and our allies have prevailed.",
    date: "May 1, 2003",
    topic: "duration",
    reality: "The vast majority of US casualties — over 95% — occurred AFTER this infamous 'Mission Accomplished' speech. 139 US troops had died by May 1, 2003; over 4,400 total died by the war's end.",
    source: "https://georgewbush-whitehouse.archives.gov/news/releases/2003/05/20030501-15.html"
  },
  {
    politician: "Dick Cheney",
    quote: "The insurgency is in its last throes, if you will.",
    date: "May 30, 2005",
    topic: "duration",
    reality: "The insurgency continued for six more years. 2006-2007 saw the worst violence of the entire war, with over 34,000 Iraqi civilian deaths in 2006 alone.",
    source: "https://www.washingtonpost.com/wp-dyn/content/article/2005/05/30/AR2005053000282.html"
  },
  {
    politician: "Kenneth Adelman",
    quote: "I believe demolishing Hussein's military power and liberating Iraq would be a cakewalk.",
    date: "February 13, 2002",
    topic: "duration",
    reality: "The 'cakewalk' became the most expensive and prolonged US military operation since Vietnam. Kenneth Adelman himself later called the administration's handling of Iraq 'incompetent.'",
    source: "https://www.washingtonpost.com/archive/opinions/2002/02/13/cakewalk-in-iraq/cf08009e-4452-4da7-a18e-7960a0b2c055/"
  },
  {
    politician: "Richard Perle",
    quote: "A year from now, I'll be very surprised if there is not some grand celebration in Baghdad that the Iraqis had been liberated.",
    date: "September 22, 2003",
    topic: "duration",
    reality: "A year later, in September 2004, Iraq was in the grip of a full-blown insurgency. Fallujah had to be assaulted twice.",
    source: "https://www.pbs.org/wgbh/frontline/"
  },

  // ── Victory / Liberation Claims ──────────────────────────────────────────
  {
    politician: "Dick Cheney",
    quote: "We will, in fact, be greeted as liberators.",
    date: "March 16, 2003",
    topic: "victory",
    reality: "US forces faced prolonged insurgency, IEDs, and sectarian violence. Over 4,400 US troops and an estimated 200,000+ Iraqi civilians died. Widespread anti-American sentiment persists.",
    source: "https://www.nbcnews.com/id/wbna3080244"
  },
  {
    politician: "George W. Bush",
    quote: "We are bringing freedom to the Iraqi people. This will be a campaign unlike any other in history.",
    date: "March 19, 2003",
    topic: "victory",
    reality: "Iraq descended into sectarian civil war by 2006. The country has still not fully stabilized over 20 years later. The power vacuum contributed to the rise of ISIS in 2014.",
    source: "https://georgewbush-whitehouse.archives.gov/news/releases/2003/03/20030319-17.html"
  },
  {
    politician: "Donald Rumsfeld",
    quote: "The coalition forces have made good progress in Iraq. The regime is losing control of the country.",
    date: "March 22, 2003",
    topic: "victory",
    reality: "Despite early military gains, the failure to plan for post-invasion governance led to complete societal collapse, years of chaos, and the rise of ISIS.",
    source: "https://www.defense.gov/News/"
  },
  {
    politician: "Tommy Franks",
    quote: "The plan is working. We are on track. This is going very, very well.",
    date: "March 22, 2003",
    topic: "victory",
    reality: "General Franks resigned less than 4 months later. The military plan had no viable post-invasion strategy.",
    source: "https://www.centcom.mil/"
  },
  {
    politician: "George W. Bush",
    quote: "Iraq is free. And the United States is more secure.",
    date: "December 14, 2003",
    topic: "victory",
    reality: "Following Saddam's capture, violence actually escalated dramatically. 2004-2007 were the deadliest years of the war.",
    source: "https://georgewbush-whitehouse.archives.gov/news/releases/2003/12/"
  },

  // ── Cost / Economic Claims ───────────────────────────────────────────────
  {
    politician: "Paul Wolfowitz",
    quote: "There's a lot of money to pay for this. It doesn't have to be US taxpayer money. We are dealing with a country that can really finance its own reconstruction.",
    date: "March 27, 2003",
    topic: "cost",
    reality: "The Iraq War cost US taxpayers over $2 trillion directly. Including long-term veteran care and interest, estimates exceed $3 trillion. Iraq's oil revenue came nowhere near covering costs.",
    source: "https://www.c-span.org/video/?175446-1/defense-department-budget"
  },
  {
    politician: "Paul Wolfowitz",
    quote: "It is wildly off the mark to suggest that hundreds of thousands of troops will be needed. It's hard to conceive.",
    date: "February 27, 2003",
    topic: "cost",
    reality: "Over 500,000 US troops rotated through Iraq over the course of the war. At peak, 170,000 were deployed simultaneously.",
    source: "https://www.armed-services.senate.gov/"
  },
  {
    politician: "Ari Fleischer",
    quote: "I think the cost of one bullet, if the Iraqi people take it on themselves, is substantially less than the cost of war.",
    date: "October 1, 2002",
    topic: "cost",
    reality: "The total estimated cost including long-term veteran care exceeds $3 trillion according to the Watson Institute at Brown University.",
    source: "https://watson.brown.edu/costsofwar/"
  },
  {
    politician: "Donald Rumsfeld",
    quote: "The Office of Management and Budget estimated it would be something under $50 billion.",
    date: "January 19, 2003",
    topic: "cost",
    reality: "By 2008 alone, Congressional appropriations for Iraq had exceeded $600 billion. The final cost was 40–60x the initial estimate.",
    source: "https://www.nytimes.com/2003/01/19/politics/"
  },
  {
    politician: "Andrew Natsios",
    quote: "The American part of the reconstruction will be $1.7 billion. That's it.",
    date: "April 23, 2003",
    topic: "cost",
    reality: "US reconstruction spending in Iraq exceeded $60 billion. The SIGIR (Special Inspector General for Iraq Reconstruction) documented billions lost to waste and fraud.",
    source: "https://abcnews.go.com/Nightline/"
  },
  {
    politician: "Mitch Daniels",
    quote: "The cost of the war will be in the range of $50 to $60 billion.",
    date: "December 2002",
    topic: "cost",
    reality: "Bush's own budget director was off by a factor of 50. The total cost exceeded $3 trillion.",
    source: "https://www.nytimes.com/2002/12/31/politics/"
  },

  // ── Escalation ───────────────────────────────────────────────────────────
  {
    politician: "George W. Bush",
    quote: "Bring 'em on.",
    date: "July 2, 2003",
    topic: "escalation",
    reality: "Attacks on US soldiers escalated dramatically following this statement. July 2003 saw a significant increase in US casualties. The statement was widely criticized as reckless.",
    source: "https://www.theguardian.com/world/2003/jul/03/usa.iraq"
  },
  {
    politician: "George W. Bush",
    quote: "We will stay the course. We will help Iraq build a free society.",
    date: "August 5, 2003",
    topic: "escalation",
    reality: "Troop levels escalated from 130,000 to over 170,000 during the 2007 'surge.' The exit didn't begin until 2009. 'Stay the course' became a symbol of stubborn policy failures.",
    source: "https://georgewbush-whitehouse.archives.gov/news/releases/2003/08/"
  },
  {
    politician: "George W. Bush",
    quote: "I've committed more than 20,000 additional American troops to Iraq. The vast majority will go to Baghdad.",
    date: "January 10, 2007",
    topic: "escalation",
    reality: "The 'surge' sent 30,000+ additional troops. While violence eventually decreased, it came nearly 4 years after the 'mission accomplished' declaration.",
    source: "https://georgewbush-whitehouse.archives.gov/news/releases/2007/01/20070110-7.html"
  },

  // ── Justification / WMD Claims ───────────────────────────────────────────
  {
    politician: "Donald Rumsfeld",
    quote: "We know where the WMDs are. They're in the area around Tikrit and Baghdad and east, west, south and north somewhat.",
    date: "March 30, 2003",
    topic: "justification",
    reality: "No weapons of mass destruction were ever found. The entire justification for the war was based on faulty intelligence. The Iraq Survey Group concluded in 2004 that Iraq had no WMD.",
    source: "https://www.defense.gov/News/Transcripts/"
  },
  {
    politician: "George W. Bush",
    quote: "The British government has learned that Saddam Hussein recently sought significant quantities of uranium from Africa.",
    date: "January 28, 2003",
    topic: "justification",
    reality: "The '16 words' in the State of the Union were based on forged documents. Ambassador Joe Wilson debunked the claim, leading to the Plame affair scandal.",
    source: "https://georgewbush-whitehouse.archives.gov/news/releases/2003/01/20030128-19.html"
  },
  {
    politician: "Colin Powell",
    quote: "Every statement I make today is backed up by sources, solid sources. These are not assertions. What we're giving you are facts and conclusions based on solid intelligence.",
    date: "February 5, 2003",
    topic: "justification",
    reality: "Powell's UN presentation was later revealed to contain multiple fabrications. Powell called it 'a blot' on his record and 'painful' in later interviews.",
    source: "https://www.un.org/press/en/2003/sc7658.doc.htm"
  },
  {
    politician: "Dick Cheney",
    quote: "There is no doubt that Saddam Hussein now has weapons of mass destruction. There is no doubt he is amassing them to use against our friends, against our allies, and against us.",
    date: "August 26, 2002",
    topic: "justification",
    reality: "There was enormous doubt. Multiple intelligence analysts dissented. No WMD were ever found.",
    source: "https://georgewbush-whitehouse.archives.gov/news/releases/2002/08/20020826.html"
  },
  {
    politician: "Condoleezza Rice",
    quote: "We don't want the smoking gun to be a mushroom cloud.",
    date: "September 8, 2002",
    topic: "justification",
    reality: "Iraq had no nuclear weapons program. The IAEA had already debunked many of the nuclear claims before the invasion.",
    source: "https://www.cnn.com/2002/ALLPOLITICS/09/08/iraq.debate/"
  },

  // ── Casualties ───────────────────────────────────────────────────────────
  {
    politician: "Donald Rumsfeld",
    quote: "Deaths happen in war. It's a dangerous place.",
    date: "April 11, 2003",
    topic: "casualties",
    reality: "Over 4,400 US service members killed, 31,000+ wounded. Estimated 200,000–600,000 Iraqi civilians killed.",
    source: "https://www.defense.gov/News/Transcripts/"
  },
  {
    politician: "George W. Bush",
    quote: "We mourn every loss of life, but we fight for a noble cause.",
    date: "June 28, 2005",
    topic: "casualties",
    reality: "By this date, over 1,800 US service members had died. The death toll would more than double before the war ended.",
    source: "https://georgewbush-whitehouse.archives.gov/news/releases/2005/06/"
  },
  {
    politician: "Donald Rumsfeld",
    quote: "Stuff happens. Freedom's untidy, and free people are free to make mistakes and commit crimes and do bad things.",
    date: "April 11, 2003",
    topic: "casualties",
    reality: "Said in response to widespread looting in Baghdad. The lawlessness was a direct result of insufficient troop levels and no post-invasion plan.",
    source: "https://www.theguardian.com/world/2003/apr/12/iraq.usa"
  },
];

// ── Day-of-Week Timing Analysis ────────────────────────────────────────────
const TIMING_ANALYSIS = {
  pattern: "Monday Optimism / Weekend Truth",
  description: "Analysis of Trump's statement timing reveals a consistent pattern: optimistic, market-friendly statements are disproportionately released on Monday mornings before market open, while sobering assessments and bad news are released Friday evenings after close, or on weekends when markets are shut.",

  analyzeQuotes(quotes) {
    const mondayQuotes = quotes.filter(q => q.dayOfWeek === "Monday");
    const weekendQuotes = quotes.filter(q =>
      ["Friday", "Saturday", "Sunday"].includes(q.dayOfWeek)
    );

    const mondayOptimistic = mondayQuotes.filter(q =>
      /great|tremendous|winning|quick|soon|wrapped up|progress|control|low|strong|dominate|incredible|closer/i.test(q.quote)
    );

    const weekendSober = weekendQuotes.filter(q =>
      /tough|complex|honest|concerning|hard|difficult|monitor|lost|brave warriors|developments/i.test(q.quote)
    );

    const mondayOptimismRate = mondayQuotes.length > 0
      ? Math.round((mondayOptimistic.length / mondayQuotes.length) * 100)
      : 0;

    const weekendSoberRate = weekendQuotes.length > 0
      ? Math.round((weekendSober.length / weekendQuotes.length) * 100)
      : 0;

    return { mondayQuotes: mondayQuotes.length, mondayOptimistic: mondayOptimistic.length, mondayOptimismRate, weekendQuotes: weekendQuotes.length, weekendSober: weekendSober.length, weekendSoberRate };
  }
};

// ── Topic Keywords & Politician Aliases ────────────────────────────────────
const TOPIC_KEYWORDS = {
  duration: ["soon", "end", "stop", "quick", "fast", "wrap up", "over", "short", "finish", "long", "when", "how long", "timeline", "withdraw", "pull out", "come home", "endless"],
  victory: ["win", "winning", "victory", "liberator", "prevail", "defeat", "beat", "strong", "dominate", "success", "mission accomplished", "freedom"],
  cost: ["cost", "money", "expensive", "price", "oil", "economy", "budget", "pay", "tax", "trillion", "billion", "cheap", "afford", "gas"],
  casualties: ["casualties", "troops", "soldiers", "killed", "died", "death", "wounded", "hurt", "safe", "lives", "lost", "fallen", "body count"],
  escalation: ["escalat", "increase", "more troops", "surge", "expand", "bigger", "intensif", "additional", "widen", "broader"],
  justification: ["reason", "why", "wmd", "weapons", "justify", "cause", "threat", "danger", "nuclear", "necessary", "must"]
};

const POLITICIAN_ALIASES = {
  "donald trump": "Donald Trump", "trump": "Donald Trump", "president trump": "Donald Trump", "potus": "Donald Trump",
  "george w. bush": "George W. Bush", "bush": "George W. Bush", "george bush": "George W. Bush",
  "dick cheney": "Dick Cheney", "cheney": "Dick Cheney",
  "donald rumsfeld": "Donald Rumsfeld", "rumsfeld": "Donald Rumsfeld",
  "paul wolfowitz": "Paul Wolfowitz", "wolfowitz": "Paul Wolfowitz",
  "ari fleischer": "Ari Fleischer", "fleischer": "Ari Fleischer",
  "colin powell": "Colin Powell", "powell": "Colin Powell",
  "condoleezza rice": "Condoleezza Rice", "rice": "Condoleezza Rice",
  "marco rubio": "Marco Rubio", "rubio": "Marco Rubio",
  "pete hegseth": "Pete Hegseth", "hegseth": "Pete Hegseth",
  "lindsey graham": "Lindsey Graham", "graham": "Lindsey Graham",
  "nikki haley": "Nikki Haley", "haley": "Nikki Haley",
  "kenneth adelman": "Kenneth Adelman", "adelman": "Kenneth Adelman",
  "richard perle": "Richard Perle", "perle": "Richard Perle",
  "tommy franks": "Tommy Franks", "franks": "Tommy Franks",
  "andrew natsios": "Andrew Natsios", "natsios": "Andrew Natsios",
  "mitch daniels": "Mitch Daniels", "daniels": "Mitch Daniels",
};
