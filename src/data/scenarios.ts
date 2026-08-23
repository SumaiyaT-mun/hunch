export type HunchOptionId = "legit" | "off" | "suspicious";

export type HunchOption = {
  id: HunchOptionId;
  label: string;
  icon: string;
  color: "green" | "yellow" | "red";
};

export type ActionOption = { id: string; letter: string; label: string };
export type LevelId = "instinct" | "suspicion" | "deep-hunch";

export type Scenario = {
  id: string;
  level: LevelId;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  contactName: string;
  message: string;
  hunchOptions: HunchOption[];
  correctHunch: HunchOptionId;
  actionOptions: ActionOption[];
  correctAction: string;
  redFlags: string[];
  explanation: string;
  trustLesson: string;
  baseXP: number;
};

export type GameLevel = {
  id: LevelId;
  number: number;
  name: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  scenarioSet: Scenario[];
};

const hunchOptions: HunchOption[] = [
  { id: "legit", label: "Looks legit", icon: "●", color: "green" },
  { id: "off", label: "Something feels off", icon: "●", color: "yellow" },
  { id: "suspicious", label: "Definitely suspicious", icon: "●", color: "red" },
];

function actions(
  correctId: string,
  correctLabel: string,
  alternatives: [string, string, string]
): ActionOption[] {
  const options: ActionOption[] = [
    {
      id: alternatives[0],
      letter: "",
      label: alternatives[1],
    },
    {
      id: correctId,
      letter: "",
      label: correctLabel,
    },
    {
      id: alternatives[2],
      letter: "",
      label: "Ignore the message",
    },
    {
      id: `${correctId}-ask`,
      letter: "",
      label: "Ask for more details in the same chat",
    },
  ];

  // Shuffle the options so the correct answer
  // isn't always in the same position.
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  // Assign A, B, C, D after shuffling
  return options.map((option, index) => ({
    ...option,
    letter: String.fromCharCode(65 + index),
  }));
}

function scenario(data: Omit<Scenario, "hunchOptions" | "baseXP">): Scenario {
  return { ...data, hunchOptions, baseXP: 100 };
}

export const instinctScenarios: Scenario[] = [
  scenario({ id: "instinct-family", level: "instinct", category: "Social", difficulty: "Easy", contactName: "Mum ❤️", message: "Hey, I'm using a new number. My phone broke. Can you send me AED 300? I'll explain when I get home ❤️", correctHunch: "off", actionOptions: actions("call", "Call Mum using the number already saved in your phone", ["send", "Send the money", "ignore"]), correctAction: "call", redFlags: ["New phone number", "Urgent request for money", "Emotional pressure"], explanation: "A new number plus an urgent money request could be an impersonator. Verify through Mum's saved number.", trustLesson: "Verify important requests through a trusted channel you already control." }),
  scenario({ id: "instinct-delivery", level: "instinct", category: "Shopping", difficulty: "Easy", contactName: "Delivery update", message: "Your package could not be delivered. Please pay AED 8.50 at the link below to reschedule delivery.", correctHunch: "suspicious", actionOptions: actions("courier", "Check the delivery through the official courier website/app", ["pay", "Pay the AED 8.50 fee", "open"]), correctAction: "courier", redFlags: ["Unexpected payment request", "Suspicious link", "Urgency"], explanation: "Small delivery fees make a scam feel harmless. Use the official courier service instead of the message link.", trustLesson: "Use official apps and websites instead of links in unexpected messages." }),
  scenario({ id: "instinct-university", level: "instinct", category: "University", difficulty: "Easy", contactName: "Student Services", message: "Your enrollment is suspended. Confirm your password and student ID at this link within 30 minutes.", correctHunch: "suspicious", actionOptions: actions("portal", "Open the official university portal directly and check your status", ["reply", "Reply with your student ID", "wait"]), correctAction: "portal", redFlags: ["Password request", "Artificial deadline", "Unverified link"], explanation: "Universities do not need your password through a surprise message. Check the official portal yourself.", trustLesson: "Navigate to important accounts yourself instead of following urgent links." }),
  scenario({ id: "instinct-giveaway", level: "instinct", category: "Social", difficulty: "Easy", contactName: "You won! 🎁", message: "Congratulations! You won an AED 2,000 giveaway. Pay AED 20 to unlock your prize today.", correctHunch: "suspicious", actionOptions: actions("verify", "Check the giveaway on the organizer's verified official page", ["pay", "Pay the AED 20 prize fee", "share"]), correctAction: "verify", redFlags: ["Unexpected prize", "Upfront fee", "Urgency"], explanation: "Real prizes do not require a fee to release them. Verify the promotion independently.", trustLesson: "A prize that asks for money first is a warning sign." }),
  scenario({ id: "instinct-account", level: "instinct", category: "Accounts", difficulty: "Easy", contactName: "Account Team", message: "We noticed unusual activity. Send us the six-digit code we just texted you to secure your account.", correctHunch: "suspicious", actionOptions: actions("secure", "Open the official app and change your password there", ["code", "Send the six-digit code", "reply"]), correctAction: "secure", redFlags: ["One-time code requested", "Unsolicited security message"], explanation: "A login code should never be shared with someone who asks for it. Use the official account controls.", trustLesson: "Never share one-time codes, even with someone claiming to be support." }),
  scenario({ id: "instinct-social-dm", level: "instinct", category: "Social", difficulty: "Easy", contactName: "@official_support", message: "Your photos are amazing! Send us your email and a small processing fee to be featured tonight.", correctHunch: "off", actionOptions: actions("profile", "Verify the account and offer through the platform's official page", ["send", "Send your email and fee", "block"]), correctAction: "profile", redFlags: ["Unexpected offer", "Processing fee", "Unverified account"], explanation: "An exciting offer can still be used to collect money or personal details. Verify the account first.", trustLesson: "Check who is behind an opportunity before sharing details or paying." }),
  scenario({ id: "instinct-bank", level: "instinct", category: "Banking", difficulty: "Easy", contactName: "Bank Alert", message: "Your card will be blocked in 10 minutes. Confirm your PIN at the link to keep it active.", correctHunch: "suspicious", actionOptions: actions("bank", "Call the bank using the number on your card", ["pin", "Enter your PIN", "wait"]), correctAction: "bank", redFlags: ["PIN request", "Threat of immediate blockage", "Suspicious link"], explanation: "Banks do not ask for your PIN by message. Contact the bank through a trusted number.", trustLesson: "A bank's urgency does not change its security rules." }),
  scenario({ id: "instinct-password", level: "instinct", category: "Accounts", difficulty: "Easy", contactName: "Password Reset", message: "We received a reset request. Click here to cancel it or your account will be deleted tonight.", correctHunch: "off", actionOptions: actions("reset", "Open the service directly and review security settings", ["click", "Click the cancellation link", "delete"]), correctAction: "reset", redFlags: ["Threat of deletion", "Unexpected reset", "Message link"], explanation: "The safest response is to visit the service directly, not use a pressured link.", trustLesson: "Unexpected password messages deserve independent verification." }),
  scenario({ id: "instinct-qr", level: "instinct", category: "Everyday", difficulty: "Easy", contactName: "Parking notice", message: "Scan this QR code to pay your parking balance before your car is clamped.", correctHunch: "suspicious", actionOptions: actions("parking", "Use the official parking app or machine to check the balance", ["scan", "Scan the QR code immediately", "pay"]), correctAction: "parking", redFlags: ["QR code", "Threat of penalty", "Unknown payment destination"], explanation: "QR codes can hide the destination. Use the known parking service instead.", trustLesson: "A familiar-looking code can still lead somewhere unsafe." }),
  scenario({ id: "instinct-everyday", level: "instinct", category: "Everyday", difficulty: "Easy", contactName: "University Student Portal", message: "Announcement: Your semester project is due Friday at 5:00 PM. Review the submission checklist in the official student portal.", correctHunch: "legit", actionOptions: actions("portal", "Open the official student portal and verify the announcement there", ["submit", "Submit immediately from this message", "ignore"]), correctAction: "portal", redFlags: [], explanation: "This is a recognizable official announcement with no unusual payment request or suspicious link.", trustLesson: "Good judgment includes recognizing legitimate communication." }),
];

export const suspicionScenarios: Scenario[] = [
  scenario({ id: "suspicion-recruiter", level: "suspicion", category: "Work", difficulty: "Medium", contactName: "Sarah — HR", message: "We found your profile and think you'd be perfect for our remote position. Before the formal interview, could you confirm your Emirates ID number so we can prepare the file?", correctHunch: "off", actionOptions: actions("research", "Verify the company and recruiter independently before sharing information", ["send", "Send the ID number", "ignore"]), correctAction: "research", redFlags: ["Sensitive information before an interview", "Limited company details"], explanation: "The tone is plausible, but the request arrives before a normal hiring process has established trust.", trustLesson: "Believable language still needs independent verification." }),
  scenario({ id: "suspicion-marketplace", level: "suspicion", category: "Marketplace", difficulty: "Medium", contactName: "Omar — Buyer", message: "I can buy your camera today. My company account is having trouble with the marketplace checkout, so my courier will send you a payment confirmation email.", correctHunch: "off", actionOptions: actions("marketplace", "Keep payment and delivery inside the marketplace platform", ["ship", "Ship after receiving the email", "email"]), correctAction: "marketplace", redFlags: ["Moving payment off-platform", "Third-party courier story"], explanation: "The buyer sounds motivated, but leaving the platform removes its protections and makes fake confirmations easier.", trustLesson: "Keep transactions inside systems that provide verification and protection." }),
  scenario({ id: "suspicion-investment", level: "suspicion", category: "Finance", difficulty: "Medium", contactName: "Daniel — Investor", message: "I have a private early-access opportunity. It is low risk, but I need your answer by tonight because the allocation closes soon.", correctHunch: "off", actionOptions: actions("research", "Research the investment independently and check its regulator", ["invest", "Transfer a small amount to reserve a place", "ask"]), correctAction: "research", redFlags: ["Artificial deadline", "Private opportunity", "Low-risk promise"], explanation: "The claim is not impossible, but urgency and a low-risk promise deserve careful research before money moves.", trustLesson: "Legitimate opportunities can withstand time for due diligence." }),
  scenario({ id: "suspicion-security", level: "suspicion", category: "Accounts", difficulty: "Medium", contactName: "Cloud Security", message: "A new device signed in near you. If this was not you, review the activity from your account security page.", correctHunch: "legit", actionOptions: actions("account", "Open the service directly and review the security page", ["link", "Use the message link to sign in", "reply"]), correctAction: "account", redFlags: [], explanation: "The alert gives a normal verification path without asking for a password or code. Use the official site directly.", trustLesson: "A legitimate warning can still be handled through a safer direct route." }),
  scenario({ id: "suspicion-friend-help", level: "suspicion", category: "Social", difficulty: "Medium", contactName: "Leila", message: "Could you pick up a package for me? The sender will text you a code. I am in a meeting and cannot answer calls.", correctHunch: "off", actionOptions: actions("confirm", "Confirm the request through a known channel before collecting anything", ["collect", "Collect it using the code", "reply"]), correctAction: "confirm", redFlags: ["Unusual favor", "Refusal to answer calls", "Unknown package"], explanation: "The request could be innocent, but the unusual process and no-call request merit confirmation.", trustLesson: "When a familiar person asks for an unusual favor, verify the context." }),
  scenario({ id: "suspicion-support", level: "suspicion", category: "Accounts", difficulty: "Medium", contactName: "Platform Support", message: "We can help recover your locked account. Please confirm the email address on file and tell us the last device you used.", correctHunch: "legit", actionOptions: actions("support", "Open support through the official platform help center", ["details", "Reply with the account details", "ignore"]), correctAction: "support", redFlags: ["Unverified support contact"], explanation: "The questions are plausible, but the contact must be verified through the platform's official help center.", trustLesson: "Support questions are only safe when the support channel is authentic." }),
  scenario({ id: "suspicion-ai-message", level: "suspicion", category: "AI", difficulty: "Medium", contactName: "Project lead", message: "I drafted the client update with an AI assistant. Please review the attached summary and send it to the client if the figures look right.", correctHunch: "legit", actionOptions: actions("review", "Check the figures and confirm the recipient before sending", ["send", "Forward it without checking", "reply"]), correctAction: "review", redFlags: ["AI-assisted content needs review"], explanation: "AI assistance is not automatically suspicious, but generated content and figures still need human review.", trustLesson: "Evaluate the process and evidence, not just the presence of AI." }),
  scenario({ id: "suspicion-impersonation", level: "suspicion", category: "Social", difficulty: "Medium", contactName: "@alex_writes", message: "I am launching a community project and would love you to share this fundraiser with your followers. No money needed from you.", correctHunch: "off", actionOptions: actions("identity", "Verify the account and fundraiser through another known profile", ["share", "Share it immediately", "reply"]), correctAction: "identity", redFlags: ["New or unverified profile", "Request to amplify a fundraiser"], explanation: "There is no direct payment request, but impersonators also seek reach. Verify before lending your audience.", trustLesson: "Protect your attention and reputation as carefully as your money." }),
  scenario({ id: "suspicion-job", level: "suspicion", category: "Work", difficulty: "Medium", contactName: "Maya — Talent", message: "Your application is moving forward. The next step is a short skills test hosted on our company-branded document portal.", correctHunch: "legit", actionOptions: actions("company", "Confirm the company domain and role through the official careers page", ["upload", "Upload identity documents to the portal", "ignore"]), correctAction: "company", redFlags: ["Branded portal still needs domain verification"], explanation: "A branded page can look convincing. Check the domain and role independently before uploading anything sensitive.", trustLesson: "Professional appearance is evidence to check, not proof by itself." }),
  scenario({ id: "suspicion-urgent-legit", level: "suspicion", category: "Everyday", difficulty: "Medium", contactName: "Building Manager", message: "Water maintenance is scheduled for 6 PM today. Please keep taps closed for 20 minutes. This notice is also posted in the resident portal.", correctHunch: "legit", actionOptions: actions("portal", "Verify the notice in the resident portal or building office", ["forward", "Forward the warning as confirmed", "ignore"]), correctAction: "portal", redFlags: [], explanation: "The timing is urgent, but the message provides a recognizable source for verification and asks for no sensitive information.", trustLesson: "Urgency alone is not a scam signal when the source and details line up." }),
];

export const deepHunchScenarios: Scenario[] = [
  scenario({ id: "deep-voice", level: "deep-hunch", category: "AI", difficulty: "Hard", contactName: "Alex 🎙️", message: "Hey, I'm stuck somewhere and need you to send me some money. Please don't call, my phone is about to die.", correctHunch: "off", actionOptions: actions("channel", "Contact the friend through another trusted channel", ["send", "Send the money quickly", "wait"]), correctAction: "channel", redFlags: ["Emotional pressure", "Unusual request", "Refusal to verify elsewhere"], explanation: "A familiar voice can be cloned. The safest test is a separate trusted channel.", trustLesson: "Familiar voices are not proof of identity." }),
  scenario({ id: "deep-video", level: "deep-hunch", category: "Deepfake", difficulty: "Hard", contactName: "CEO video call", message: "The video looks and sounds like your CEO. They ask you to approve a confidential transfer before the board meeting and say not to mention it yet.", correctHunch: "off", actionOptions: actions("callback", "End the call and verify through the normal executive contact process", ["approve", "Approve the transfer while they are on camera", "record"]), correctAction: "callback", redFlags: ["Secrecy", "Financial pressure", "Unexpected video call"], explanation: "A convincing video is not a secure approval channel for a high-value transfer.", trustLesson: "High-stakes requests need established verification procedures." }),
  scenario({ id: "deep-phish", level: "deep-hunch", category: "Accounts", difficulty: "Hard", contactName: "Document Share", message: "A familiar client shared a document. The sign-in page uses your company's colors and asks you to re-enter your password to view the contract.", correctHunch: "off", actionOptions: actions("domain", "Open the client portal directly and check for the document there", ["signin", "Sign in through the shared page", "reply"]), correctAction: "domain", redFlags: ["Unexpected sign-in prompt", "Brand imitation", "Password re-entry"], explanation: "Visual polish can be copied. A direct visit to the trusted portal avoids the link's identity trap.", trustLesson: "Inspect the route to a request, not only how professional it looks." }),
  scenario({ id: "deep-real-recruiter", level: "deep-hunch", category: "Work", difficulty: "Hard", contactName: "Jordan — Real Company HR", message: "I am following up on your application from our official careers site. Before we schedule the final interview, please confirm which time zone works for you.", correctHunch: "legit", actionOptions: actions("careers", "Confirm the role and recruiter through the official careers portal", ["details", "Send identity and bank details", "ignore"]), correctAction: "careers", redFlags: [], explanation: "The request is limited, matches an application you recognize, and can be checked through the official careers portal.", trustLesson: "Careful verification can support trust instead of blocking every opportunity." }),
  scenario({ id: "deep-social-engineering", level: "deep-hunch", category: "Security", difficulty: "Hard", contactName: "IT Help Desk", message: "I am helping with an outage. Your account is one of the last blocking the fix. Read me the approval code while I keep you on the line.", correctHunch: "suspicious", actionOptions: actions("ticket", "Hang up and contact IT through the published help desk number", ["code", "Read the approval code", "wait"]), correctAction: "ticket", redFlags: ["Pressure to stay on the line", "Approval code request", "Authority claim"], explanation: "Attackers use urgency and authority to prevent independent checks. The help desk can be reached through its known process.", trustLesson: "Pressure is a reason to slow down and use the official process." }),
  scenario({ id: "deep-family-emergency", level: "deep-hunch", category: "Social", difficulty: "Hard", contactName: "Unknown family number", message: "Your brother has been arrested after an accident. Send AED 2,000 to this account now and do not call him because it will make things worse.", correctHunch: "suspicious", actionOptions: actions("family", "Contact your brother and another family member through saved numbers", ["send", "Send the money immediately", "reply"]), correctAction: "family", redFlags: ["Extreme emotional pressure", "Secrecy request", "Urgent transfer"], explanation: "A frightening claim is still a claim. Verify the people and situation through trusted numbers before sending money.", trustLesson: "Fear should trigger verification, not bypass it." }),
  scenario({ id: "deep-ai-support", level: "deep-hunch", category: "AI", difficulty: "Hard", contactName: "Support assistant", message: "Our automated security assistant detected a takeover. To restore access, upload a selfie with your passport to this secure recovery chat.", correctHunch: "off", actionOptions: actions("help", "Use the official service recovery page and published support process", ["upload", "Upload the documents in the chat", "reply"]), correctAction: "help", redFlags: ["Sensitive identity upload", "Unverified recovery chat"], explanation: "AI-styled support can be imitated. Identity recovery should happen through the service's official route.", trustLesson: "Automation does not make an unverified channel trustworthy." }),
  scenario({ id: "deep-crypto", level: "deep-hunch", category: "Finance", difficulty: "Hard", contactName: "Private analyst group", message: "The market signal is time-sensitive. You can mirror our wallet for a guaranteed 18% return, but the access window closes in ten minutes.", correctHunch: "suspicious", actionOptions: actions("regulator", "Research the firm, wallet, and regulator independently before investing", ["fund", "Transfer funds to mirror the wallet", "ask"]), correctAction: "regulator", redFlags: ["Guaranteed return", "Countdown pressure", "Crypto wallet transfer"], explanation: "Sophisticated investment scams use technical language to hide the lack of accountable verification.", trustLesson: "Complexity and confidence are not evidence of legitimacy." }),
  scenario({ id: "deep-takeover", level: "deep-hunch", category: "Accounts", difficulty: "Hard", contactName: "Workspace Admin", message: "We can preserve your mailbox, but you must approve this sign-in from your authenticator now. I will stay with you until it is done.", correctHunch: "suspicious", actionOptions: actions("admin", "Contact the workspace administrator through the internal directory", ["approve", "Approve the sign-in", "reply"]), correctAction: "admin", redFlags: ["Approval fatigue", "Unsolicited admin contact", "Authenticator prompt"], explanation: "An attacker may be trying to make you approve their login while sounding helpful.", trustLesson: "Never approve an authentication prompt you did not initiate." }),
  scenario({ id: "deep-legit-ai", level: "deep-hunch", category: "AI", difficulty: "Hard", contactName: "University AI Lab", message: "The lab's official portal has published a notice about a new AI-literacy workshop. Registration is optional and uses your existing student login.", correctHunch: "legit", actionOptions: actions("portal", "Open the official university portal and verify the workshop there", ["register", "Use a link forwarded by a friend", "ignore"]), correctAction: "portal", redFlags: [], explanation: "The topic is AI, but the sender and optional registration process are consistent with a normal university announcement.", trustLesson: "A suspicious topic is not enough to reject a message; check the evidence." }),
];

export const levels: GameLevel[] = [
  { id: "instinct", number: 1, name: "INSTINCT", description: "Trust your first reaction.", difficulty: "Beginner", scenarioSet: instinctScenarios },
  { id: "suspicion", number: 2, name: "SUSPICION", description: "Not everything suspicious is a scam.", difficulty: "Intermediate", scenarioSet: suspicionScenarios },
  { id: "deep-hunch", number: 3, name: "DEEP HUNCH", description: "When AI makes deception look real.", difficulty: "Advanced", scenarioSet: deepHunchScenarios },
];