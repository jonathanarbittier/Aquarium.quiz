import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

const projectRoot = new URL("../", import.meta.url).pathname;
const root = resolve(projectRoot, process.argv[2] || ".");
const site = "https://tankpicks.com";
const updated = "October 29, 2026";

const sources = {
  aqueonFiltration: ["Aqueon: Everything You Need to Know About Filtration", "https://www.aqueon.com/articles/filtration"],
  aqueonBasics: ["Aqueon: Aquarium Filtration Basics", "https://www.aqueon.com/articles/aquarium-filtration-basics"],
  aqueonCleaning: ["Aqueon: Aquarium Cleaning Checklist", "https://www.aqueon.com/articles/aquarium-cleaning-checklist"],
  aqueonCanister: ["Aqueon: QuietFlow Canister Filters", "https://www.aqueon.com/products/filters-media/quietflow-canister-filters"],
  fluvalAc: ["Fluval: AC Series Aquarium Filters", "https://fluvalaquatics.com/us/shop/product/aquaclear"],
  fluvalC: ["Fluval: C Series Aquarium Filters", "https://fluvalaquatics.com/us/shop/product/c-series-clip-on-filters"],
  fluvalFx: ["Fluval: FX6 and FX Series specifications", "https://fluvalaquatics.com/us/shop/product/fx6-canister-filter-up-to-400-us-gal-1500-l"],
  fluvalU3: ["Fluval: U3 Underwater Filter specifications", "https://fluvalaquatics.com/us/shop/product/u3-underwater-filter-up-to-40-us-gal-150-l"],
  seachemTidal: ["Seachem: Tidal Power Filters", "https://www.seachem.com/tidal-filters.php"],
  seachemCompare: ["Seachem: Tidal model comparison", "https://www.seachem.com/tidal-compare.php"],
  sponge: ["Aquarium Co-Op: Sponge filter sizing", "https://www.aquariumcoop.com/blogs/faqs/sponge-filter-sizes"],
  eheim: ["EHEIM: Classic 1500XL specifications and manual", "https://eheim.com/en_GB/spare-parts/technology/external-filters/classic/classic-1500xl?c=2581"],
  pennPlax: ["Penn-Plax: Cascade and Max-Flow manufacturer catalog", "https://www.pennplax.com/_files/ugd/7fbf19_73d4784eebce423c9e37925fbb5b0e15.pdf"],
  redSeaSkimmer: ["Red Sea: REEFER skimmer manual", "https://redseafish.com/wp-content/uploads/2020/11/4071_Skimmer-Manual_EN_FR_DE_JP_CH_-v19a.pdf"],
  redSeaNano: ["Red Sea: MAX NANO filtration and circulation system", "https://redseafish.com/aquarium-systems/max-nano-series/"],
  coralife: ["Coralife: BioCube Protein Skimmer", "https://www.coralifeproducts.com/all-products/biocube/protein-skimmer"]
};

const guides = [
  {
    slug: "filter-types",
    title: "Aquarium Filter Types Explained",
    description: "Compare hang-on-back, canister, internal, sponge, and sump filters by media capacity, maintenance, flow, and installation needs.",
    intro: "Filter labels describe where equipment sits and how water moves through it. They do not, by themselves, tell you whether a filter suits your livestock, maintenance routine, or available space.",
    body: `
      <h2>Start with the job, not the format</h2>
      <p>Every aquarium needs a way to capture debris and support biological filtration. Chemical media is optional and task-specific. Aqueon’s filtration overview separates these roles into mechanical, biological, and chemical stages; one device may perform all three, but the balance and media volume vary.</p>
      <table class="comparison-table"><thead><tr><th>Format</th><th>Useful strengths</th><th>Important tradeoffs</th></tr></thead><tbody>
        <tr><td>Hang-on-back (HOB)</td><td>Easy access, visible return flow, compact media chamber</td><td>Needs rim and wall clearance; the return can be strong in shallow tanks</td></tr>
        <tr><td>Canister</td><td>Large external media volume, flexible media arrangement, discreet display</td><td>Requires cabinet space, hoses, priming, and deliberate leak checks</td></tr>
        <tr><td>Internal</td><td>No external hoses; useful where external filtration is impractical</td><td>Occupies tank space and may be visually prominent</td></tr>
        <tr><td>Sponge</td><td>Gentle intake, simple biological surface, useful for fry and shrimp</td><td>Needs an air pump and usually provides limited debris polishing</td></tr>
        <tr><td>Sump</td><td>Flexible equipment space and large system volume</td><td>Requires an overflow, return pump, plumbing, and careful water-level planning</td></tr>
      </tbody></table>
      <h2>Hang-on-back filters</h2>
      <p>A HOB filter pulls water into a chamber and returns it over the aquarium edge. It is easy to inspect and usually faster to service than a canister. Check the tank’s rim thickness, the gap behind the aquarium, the minimum operating water level, and whether the outflow can be reduced. Seachem publishes separate wall, trim, and internal-clearance dimensions for its Tidal models; that is a useful reminder that gallon rating alone does not guarantee physical fit.</p>
      <h2>Canister filters</h2>
      <p>A canister sits below or beside the aquarium. Its main advantage is media space outside the display. Its main cost is service complexity: hoses must be routed without kinks, valves and seals need inspection, and a filled canister can be heavy. Confirm cabinet height and door clearance before purchase, not after the filter arrives.</p>
      <h2>Internal and sponge filters</h2>
      <p>Internal filters keep the pump and media inside the aquarium. Fluval describes the U3 as a primary filter for smaller tanks or a supplementary filter for larger tanks, with three output positions for different flow patterns. Air-driven sponge filters are even simpler. They can protect small livestock from a powered intake, but the air pump, airline, and check valve are separate parts of the system.</p>
      <h2>Sumps are systems, not just filters</h2>
      <p>A sump can hold mechanical media, biological media, heaters, probes, a protein skimmer, and the return pump. It also introduces overflow and return-plumbing decisions. Choose it when you want a configurable system and can maintain stable operating and power-off water levels.</p>
      <div class="callout"><p><strong>Practical choice:</strong> pick the simplest format that provides enough published capacity, safe flow, usable media space, and maintenance access for your actual aquarium.</p></div>`,
    sources: [sources.aqueonFiltration, sources.seachemTidal, sources.fluvalU3, sources.sponge]
  },
  {
    slug: "aquarium-filter-sizing",
    title: "How to Size an Aquarium Filter",
    description: "Use manufacturer tank ratings, actual water volume, flow, stocking, and maintenance access to choose an aquarium filter without relying on one number.",
    intro: "A manufacturer’s aquarium-capacity range is a useful eligibility check. It is not a calculation of fish waste, aquascape resistance, or the amount of maintenance your tank will need.",
    body: `
      <h2>1. Estimate actual water volume</h2>
      <p>The nameplate volume of a tank is not always the volume of water in operation. Substrate, rocks, wood, an air gap, and internal equipment displace water. Use a realistic estimate when comparing flow and dosing; use the tank’s nominal size as a conservative reference when checking whether equipment physically and operationally fits.</p>
      <h2>2. Treat the published range as a boundary</h2>
      <p>Do not recommend a filter below its published maximum capacity. Within a product family, ratings and flow can change sharply. Fluval’s AC line, for example, publishes distinct ranges from 5–20 gallons for the AC20 through 60–110 gallons for the AC110. The range tells you which model the manufacturer intends for a tank size; it does not promise identical performance in every aquarium.</p>
      <h2>3. Add headroom for the reason you actually need it</h2>
      <p>Extra capacity may help with large fish, heavier feeding, or a high-waste setup, but “oversize everything” is not a complete rule. A larger filter can also create excessive intake or return flow, occupy more space, and cost more to service. Headroom is useful only when the livestock can tolerate the flow and the owner can maintain the equipment.</p>
      <h2>4. Separate flow from capacity</h2>
      <p>Gallons per hour and tank rating describe different things. Flow describes water movement under specified test conditions. Capacity combines the manufacturer’s intended aquarium range with the filter’s design and media. Fluval publishes both pump output and lower filter-circulation figures for FX models, demonstrating why a single headline GPH number should not be substituted for a tank rating.</p>
      <h2>5. Check coverage and redundancy</h2>
      <p>Long aquariums can have quiet zones even when total flow looks adequate. Intake and return placement matter. Aqueon notes that aquariums of 100 gallons or more may require multiple filters. Two filters can improve coverage and provide partial filtration during maintenance, but they double the number of intakes, cords, and service points.</p>
      <h2>A sizing checklist</h2>
      <ul>
        <li>The tank falls inside the manufacturer’s published range.</li>
        <li>The intake and output are appropriate for the most flow-sensitive animal.</li>
        <li>The filter fits the rim, cabinet, hoses, and maintenance path.</li>
        <li>Replacement media, seals, and impellers are available.</li>
        <li>The maintenance schedule is realistic for the owner.</li>
      </ul>`,
    sources: [sources.fluvalAc, sources.fluvalFx, sources.aqueonFiltration, sources.eheim]
  },
  {
    slug: "aquarium-flow-rate",
    title: "Aquarium Filter Flow Rate Without the Guesswork",
    description: "Understand pump output, filter circulation, turnover estimates, flow distribution, and gentle-flow adjustments before comparing aquarium filters.",
    intro: "Flow rate is useful when you know which flow rate you are reading. Pump output, filter circulation, and water movement inside a furnished aquarium are not interchangeable.",
    body: `
      <h2>Pump output is not always filtered circulation</h2>
      <p>Manufacturers may publish more than one flow figure. Fluval lists the FX6 at 925 GPH pump output and 563 GPH filter circulation. The lower circulation figure reflects water moving through the filter system rather than the pump running as an isolated component. Compare like with like when evaluating models.</p>
      <h2>Turnover is an estimate, not a universal target</h2>
      <p>Dividing a published GPH figure by aquarium volume gives a nominal turnovers-per-hour number. That calculation can help compare two filters, but it does not describe current at every location in the tank. Media loading, dirty hoses, head height, elbows, spray bars, and reduced-flow settings can all change delivered flow.</p>
      <h2>Distribution matters as much as the total</h2>
      <p>A strong return pointed across the surface can improve agitation but leave a sheltered area behind rockwork. A spray bar can spread the same return over a wider area. Two smaller filters placed at opposite ends may cover a long aquarium better than one large filter, even if the combined headline flow is similar.</p>
      <h2>Gentle livestock need an intake plan and an output plan</h2>
      <p>Reducing only the return does not protect shrimp or fry from an exposed intake. Use a suitable intake sponge or a filter designed around a gentle intake. Fluval’s U3 provides multiple output positions, including a spray bar for a more even flow. Seachem’s Tidal line publishes adjustable flow, and the larger models also provide intake regulation.</p>
      <h2>How to check flow in your own tank</h2>
      <ol>
        <li>Observe food, fine plant leaves, and suspended particles in several areas.</li>
        <li>Look for animals constantly avoiding the return or struggling to hold position.</li>
        <li>Check whether debris repeatedly settles in the same dead zone.</li>
        <li>Inspect flow again after the media has been in service, not only when it is new.</li>
        <li>Change direction, spread, or intake protection before buying a larger pump.</li>
      </ol>
      <div class="callout"><p><strong>Use GPH as a comparison input.</strong> Use animal behavior, debris patterns, and manufacturer operating guidance to judge the finished setup.</p></div>`,
    sources: [sources.fluvalFx, sources.seachemCompare, sources.fluvalU3]
  },
  {
    slug: "betta-shrimp-filters",
    title: "Filters for Betta, Shrimp, Fry, and Gentle-Flow Tanks",
    description: "Plan safe intake protection and gentle, adjustable return flow for bettas, shrimp, fry, and other flow-sensitive aquarium livestock.",
    intro: "For small or slow-swimming livestock, filter safety depends on two separate questions: can the intake trap the animal, and does the return create a current it cannot comfortably leave?",
    body: `
      <h2>Begin with the intake</h2>
      <p>Shrimp, newly hatched fish, and long-finned fish can be vulnerable around coarse intake strainers. A correctly fitted pre-filter sponge increases the intake area and lowers suction at any single opening. It also catches debris before it reaches the main filter, so it must be rinsed when flow begins to fall.</p>
      <h2>Then control the return</h2>
      <p>An adjustable filter gives you more room to tune the current. Direction matters too: aim a return toward glass, spread it through a spray bar, or raise the water level under a HOB return to reduce a hard waterfall. Fluval says its C Series refiltration design can reduce output while recirculating some water through the chamber, and its U3 includes a spray-bar option for gentler, more even flow.</p>
      <h2>When a sponge filter is the simple answer</h2>
      <p>An air-driven sponge filter has no powered intake impeller at the sponge. Water is drawn through a broad porous surface, making it useful in breeding and shrimp tanks. Aquarium Co-Op publishes four sponge sizes beginning at 5 gallons for its nano model. Follow the maker’s own sizing chart; a size name is not a universal rating across brands.</p>
      <h2>Parts people forget</h2>
      <ul>
        <li>An air pump sized for the depth and number of sponge filters.</li>
        <li>Airline tubing and a check valve installed in the correct direction.</li>
        <li>A control valve if the air output needs adjustment.</li>
        <li>A second sponge or established media when cleaning would otherwise remove most biological surface at once.</li>
      </ul>
      <h2>When a HOB or canister can still work</h2>
      <p>A conventional powered filter can suit a gentle-flow tank when its minimum flow is manageable, the intake is protected, and the return is diffused. Do not assume a filter is safe because its tank rating is small. A compact pump can still produce a concentrated jet in a short or sparsely decorated aquarium.</p>
      <h2>Maintenance without destabilizing the tank</h2>
      <p>Rinse a sponge when clogging reduces flow, using removed aquarium water when the sponge is an important biological surface. Avoid replacing or sterilizing all established media at the same time. The goal is to restore water movement while retaining useful biological colonization.</p>`,
    sources: [sources.sponge, sources.fluvalC, sources.fluvalU3, sources.aqueonCleaning]
  },
  {
    slug: "large-aquarium-filtration",
    title: "Filtration Planning for Large Aquariums",
    description: "Plan filtration for large aquariums using coverage, redundancy, cabinet space, service access, and manufacturer-confirmed specifications.",
    intro: "Large tanks are not simply small tanks with a larger gallon number. Their length, equipment weight, hose runs, service volume, and failure consequences all increase.",
    body: `
      <h2>Think in zones</h2>
      <p>A long aquarium can meet a total flow target while still collecting debris at one end. Map where each intake will draw from and where each return will push water. Rockwork and large decorations can block circulation. Aqueon notes that tanks of 100 gallons or more may need multiple filters because of their length.</p>
      <h2>Use manufacturer figures carefully</h2>
      <p>Fluval publishes the FX6 for aquariums up to 400 US gallons, with 563 GPH filter circulation and a 20-liter canister. EHEIM publishes the Classic 1500XL for approximately 300–1500 liters, with an 18-liter filter volume. Those figures help establish eligibility and physical scale, but neither manufacturer can account for your fish size, feeding, rockwork, or maintenance interval.</p>
      <h2>Redundancy can be more useful than one oversized unit</h2>
      <p>Two independent filters can improve end-to-end coverage and allow one unit to keep running while the other is serviced. Redundancy is not automatic protection: both filters may still stop during a power outage, and both need separate maintenance. Put critical equipment on appropriately planned circuits and verify restart behavior after power is restored.</p>
      <h2>Measure the service path</h2>
      <p>Record cabinet opening width, internal height, hose bend radius, valve access, and the distance to a sink or drain. The EHEIM 1500XL has a large 23-liter container, while the FX6 is roughly 21 inches tall. A specification that fits inside the cabinet may still be impractical if the lid cannot be removed or the filled canister cannot be lifted safely.</p>
      <h2>Do not convert GPH directly into capacity</h2>
      <p>Penn-Plax publishes 820 GPH and “150 gallons+” for the Cascade Max-Flow, but its manufacturer catalog does not state the 164–273 gallon rating found on some retailer pages. TankPicks therefore does not rank that model until a manufacturer-confirmed upper capacity is available. Flow alone is not enough to invent one.</p>
      <h2>Plan maintenance before purchase</h2>
      <ul>
        <li>Choose valves that isolate hoses without draining them.</li>
        <li>Leave room to remove media baskets vertically.</li>
        <li>Decide where dirty filter water will be carried or drained.</li>
        <li>Keep seals, impellers, and critical fittings available.</li>
        <li>Stagger service on multiple filters rather than cleaning everything together.</li>
      </ul>`,
    sources: [sources.aqueonFiltration, sources.fluvalFx, sources.eheim, sources.pennPlax]
  },
  {
    slug: "freshwater-vs-saltwater-filters",
    title: "Freshwater vs. Saltwater Aquarium Filters",
    description: "Understand the difference between saltwater-compatible hardware and a complete marine or reef filtration system.",
    intro: "A filter can be safe to operate in saltwater without being a complete filtration plan for a marine aquarium—and especially not for a reef aquarium.",
    body: `
      <h2>Compatibility is the first check</h2>
      <p>Use the manufacturer’s water-type statement. Fluval lists the FX Series for freshwater and saltwater aquariums. EHEIM’s Classic 1500XL manual also specifies fresh and salt water use. A freshwater-only listing should not be extended to marine use by assumption.</p>
      <h2>The same hardware can serve different roles</h2>
      <p>In freshwater, a canister or HOB filter may provide most of the system’s mechanical and biological filtration. In a marine fish-only setup, the same compatible device may handle debris and media while rock and other surfaces also support biological processes. The maintenance consequence remains: trapped organic material stays in the system until the mechanical media is cleaned.</p>
      <h2>Reef tanks add requirements beyond compatibility</h2>
      <p>Red Sea’s reef systems combine mechanical filtration, protein skimming, chemical-media space, biological surfaces, and dedicated circulation. That design illustrates why “saltwater compatible” should not be read as “complete reef solution.” Corals and other sessile animals also depend on flow distribution that a filter return may not provide by itself.</p>
      <h2>Saltwater setup questions</h2>
      <ul>
        <li>Does the manufacturer explicitly list marine or saltwater use?</li>
        <li>How will trapped waste be removed before it breaks down?</li>
        <li>Is a protein skimmer part of the plan, and where will it fit?</li>
        <li>What provides in-display circulation apart from filtration return flow?</li>
        <li>How will evaporation and salinity stability be managed?</li>
      </ul>
      <h2>Freshwater setup questions</h2>
      <p>Freshwater tanks still vary widely. A planted tank may need gentle distribution that does not uproot plants. Large cichlids or goldfish may produce more solid waste. Shrimp and fry need intake protection. Choose around livestock and maintenance rather than treating “freshwater” as one load profile.</p>
      <div class="callout"><p><strong>Bottom line:</strong> verify material and manufacturer compatibility first, then design the complete filtration and circulation system for the animals you intend to keep.</p></div>`,
    sources: [sources.fluvalFx, sources.eheim, sources.aqueonCanister, sources.redSeaNano]
  },
  {
    slug: "reef-tank-filtration",
    title: "Reef Tank Filtration: What a Canister Filter Cannot Decide",
    description: "Learn why reef filtration requires coordinated biological filtration, mechanical waste removal, protein skimming, circulation, and stable water management.",
    intro: "A saltwater-compatible canister or HOB filter can be useful on a reef aquarium, but its gallon rating cannot size the entire reef filtration system.",
    body: `
      <h2>Mechanical filtration only removes waste when you remove the media</h2>
      <p>Filter floss, socks, sponges, and canister pads capture suspended material. The waste is still in contact with aquarium water until the media is cleaned or replaced. Red Sea’s skimmer manual contrasts this with protein skimming, which collects suspended and dissolved organics in a cup outside the water flow.</p>
      <h2>Protein skimming has a different job</h2>
      <p>A skimmer mixes air and water so organic compounds adhere to bubbles and collect as foam. It does not replace every mechanical or biological component. Red Sea describes a successful reef system as using regularly cleaned mechanical filtration and an efficient protein skimmer as early treatment stages. Coralife likewise specifies its skimmers for removing dissolved organics from saltwater.</p>
      <h2>Biological filtration is distributed</h2>
      <p>Biological activity lives on rock, sand, media, and other wet surfaces. Adding a canister increases available media, but the system still depends on stable oxygenated flow and appropriate stocking. Cleaning all biological media aggressively at once can remove a large share of the established surface community.</p>
      <h2>Circulation is not the same as filter return</h2>
      <p>Reef animals often need broad, changing water movement across the display. Red Sea’s MAX NANO systems use dedicated return circulation in addition to the filtration path. A filter return may contribute to movement, but it should not automatically be treated as the only circulation source.</p>
      <h2>A sump is optional, but the functions are not</h2>
      <p>A sump packages equipment, water-level control, mechanical media, and skimming in one place. An all-in-one rear chamber can perform similar functions. A sumpless reef can also work, but the owner still needs a plan for each function and for maintenance access.</p>
      <h2>What TankPicks reef results mean</h2>
      <p>The quiz only confirms that a listed conventional filter is manufacturer-rated for the selected tank size and marked for marine use. It does not size a protein skimmer, sump, return pump, wave pumps, live rock, refugium, or nutrient-management strategy. Treat the result as one equipment comparison inside a larger plan.</p>`,
    sources: [sources.redSeaSkimmer, sources.redSeaNano, sources.coralife, sources.fluvalFx]
  },
  {
    slug: "filter-maintenance",
    title: "Aquarium Filter Maintenance Without Losing Stability",
    description: "Build a practical filter-maintenance routine for mechanical media, biological media, chemical media, hoses, seals, and impellers.",
    intro: "The right maintenance interval is the one that restores flow and removes trapped waste before performance falls—without replacing every established surface at once.",
    body: `
      <h2>Use condition as well as the calendar</h2>
      <p>Check return flow, intake strength, visible debris, unusual noise, and media condition. A fixed monthly reminder is useful, but a heavily fed tank may clog mechanical media sooner, while a lightly stocked tank may not. Follow the product manual when it gives a specific replacement interval.</p>
      <h2>Before opening a filter</h2>
      <ol>
        <li>Unplug the filter and any equipment that could run dry as the water level changes.</li>
        <li>Close isolation valves where provided.</li>
        <li>Place towels or a shallow tray under hoses and the canister.</li>
        <li>Note media order before removing baskets.</li>
        <li>Inspect the power cord, hose connections, and seals.</li>
      </ol>
      <h2>Mechanical media</h2>
      <p>Rinse or replace pads and floss when loading restricts flow or allows debris to break down. Coarse sponges can often be rinsed and reused if the manufacturer permits it. Fine polishing pads clog faster and should be treated as a finishing stage rather than the only mechanical layer.</p>
      <h2>Biological media</h2>
      <p>Aqueon’s cleaning checklist recommends swishing biological media in removed aquarium water and holding it there while the filter is serviced. Its QuietFlow instructions specifically say not to discard the biological grid or rinse it with tap water. Avoid replacing every established biological stage together unless the manufacturer or a contamination event requires it.</p>
      <h2>Chemical media</h2>
      <p>Activated carbon and specialty resins have finite capacity. Replace them for the task and interval specified by the maker. Do not use fresh chemical media as a substitute for correcting overfeeding, insufficient water changes, or an undersized mechanical stage.</p>
      <h2>Impellers, hoses, and seals</h2>
      <p>Reduced flow and noise can come from an impeller well, not only dirty media. Fluval’s C Series support guidance points to impeller cleaning when motor noise develops. Clean hoses before buildup becomes severe, lubricate seals only with a manufacturer-approved product, and replace flattened or damaged O-rings.</p>
      <h2>Restart and verify</h2>
      <p>Prime as instructed, open all intended valves, check the full hose path for leaks, and confirm the return after air clears. Recheck a canister several minutes later and again after it has run under normal cabinet conditions.</p>`,
    sources: [sources.aqueonCleaning, sources.aqueonBasics, sources.fluvalC]
  },
  {
    slug: "filter-media",
    title: "Aquarium Filter Media: Mechanical, Biological, and Chemical",
    description: "Arrange aquarium filter media by function and understand when to rinse, retain, replace, or omit each stage.",
    intro: "Media works best when each layer has a defined job. More media is not automatically better if the arrangement clogs quickly, bypasses water, or makes routine service difficult.",
    body: `
      <h2>Mechanical media captures particles</h2>
      <p>Coarse foam catches larger debris and protects finer stages from immediate clogging. Fine pads polish smaller suspended particles but usually need more frequent service. Aqueon notes that finer media can improve clarity at the cost of faster loading. Arrange mechanical stages from coarse to fine when the filter’s prescribed flow path allows it.</p>
      <h2>Biological media provides wet, oxygenated surface</h2>
      <p>Porous rings, foam, grids, and other permanent media support microbial communities involved in processing nitrogenous waste. The important variables are continuous water flow, oxygen, and stable handling. Replacing all biological media at once removes established surface area; stagger work when possible.</p>
      <h2>Chemical media solves a defined problem</h2>
      <p>Activated carbon adsorbs some dissolved compounds and discoloration. Other resins target specific substances. Use chemical media because the aquarium has a defined need, not because an empty basket must be filled. Exhausted media should be replaced according to the manufacturer’s instructions.</p>
      <h2>Media order follows the water path</h2>
      <p>The ideal order depends on where water enters and exits the product. Fluval explains that FX water first moves through foam before passing through central media trays. Read the diagram for your exact model; copying a basket order from a different filter can put fine media first or allow bypass.</p>
      <h2>A practical arrangement</h2>
      <ol>
        <li>Coarse mechanical stage at the first accessible point.</li>
        <li>Finer mechanical stage where it can be removed without dismantling everything.</li>
        <li>Stable biological media in a high-flow, continuously wet area.</li>
        <li>Task-specific chemical media where water cannot bypass it.</li>
      </ol>
      <h2>Do not let media become a maintenance trap</h2>
      <p>An overpacked basket can reduce flow and make cleaning so unpleasant that service is delayed. Leave the space and handles needed to remove each layer. Keep a written basket map for canisters with several trays, and date disposable media when the maker specifies a replacement window.</p>
      <div class="callout"><p><strong>Media is not a cure for undersizing.</strong> If water bypasses clogged pads or the owner cannot service the filter safely, adding another pouch will not solve the design problem.</p></div>`,
    sources: [sources.aqueonBasics, sources.aqueonFiltration, sources.fluvalFx, sources.fluvalAc]
  },
  {
    slug: "hob-vs-canister-filter",
    title: "Hang-on-Back vs. Canister Filters",
    description: "Compare HOB and canister filters by installation, media space, flow, maintenance access, leak points, and aquarium layout.",
    intro: "A canister is not automatically an upgrade, and a HOB is not automatically a beginner-only choice. The better format is the one that fits the tank and will actually be maintained.",
    body: `
      <table class="comparison-table"><thead><tr><th>Question</th><th>HOB filter</th><th>Canister filter</th></tr></thead><tbody>
        <tr><td>Where does it sit?</td><td>On the aquarium rim</td><td>Below or beside the aquarium</td></tr>
        <tr><td>Media access</td><td>Usually quick from above</td><td>More media, but the unit must be isolated and opened</td></tr>
        <tr><td>Display impact</td><td>Visible box and return at the rim</td><td>Mostly hoses and intake/return visible</td></tr>
        <tr><td>Clearance</td><td>Wall, rim, lid, and water-level clearance</td><td>Cabinet height, hose routing, and valve access</td></tr>
        <tr><td>Common service issue</td><td>Waterfall noise or exposed intake</td><td>Heavy canister, trapped air, seals, or dirty hoses</td></tr>
      </tbody></table>
      <h2>Choose a HOB when access is the priority</h2>
      <p>HOB media is visible and usually easy to remove without carrying a water-filled vessel. This makes frequent mechanical-media service more likely. Seachem’s Tidal models also publish self-priming, surface-skimming, and adjustable-flow features. The tradeoff is physical clearance and a return that may be concentrated.</p>
      <h2>Choose a canister when external media space matters</h2>
      <p>Aqueon describes canisters as holding more media and offering flexible media choices. They can keep equipment out of the display and support spray bars or directional returns. The cost is a longer service path: valves, hoses, baskets, impeller, and seals all need access.</p>
      <h2>Compare the exact installation</h2>
      <p>Measure the tank rim before choosing a HOB and the cabinet before choosing a canister. For a HOB, confirm the lid can close, the intake reaches the intended depth, and the filter remains within its minimum water line. For a canister, confirm that hoses reach without kinks and that the head can be removed inside the cabinet.</p>
      <h2>Compare noise honestly</h2>
      <p>A HOB may create waterfall noise when the aquarium water level drops. A canister may transmit pump vibration through the cabinet or become noisy when air is trapped. Either format can be quiet when installed and maintained correctly; product design and setup matter more than the label.</p>
      <h2>Maintenance decides long-term performance</h2>
      <p>If a canister’s capacity encourages long gaps between cleaning, captured waste remains in the water path. If a HOB cartridge is replaced wholesale without preserving its permanent biological stage, stability can be disrupted. Choose the format whose routine you can perform consistently.</p>
      <div class="callout"><p><strong>Simple decision rule:</strong> choose HOB for direct access and compact plumbing; choose canister for external media volume and flexible returns. Reject either one if it does not physically fit.</p></div>`,
    sources: [sources.aqueonFiltration, sources.seachemTidal, sources.fluvalFx]
  }
];

function footer() {
  return `<footer class="site-footer"><div class="wrap footer-inner"><p>TankPicks compares published specifications. It does not claim hands-on testing.</p><nav aria-label="Footer"><a href="/guides/">Guides</a><a href="/about/">About</a><a href="/methodology/">Methodology</a><a href="/privacy/">Privacy</a></nav></div></footer>`;
}

function head({ title, description, path, type = "article" }) {
  const url = `${site}${path}`;
  return `<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="${description}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="theme-color" content="#06233d" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="${type}" />
  <meta property="og:site_name" content="TankPicks" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${site}/assets/reef-hero-2172.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${site}/assets/reef-hero-2172.webp" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="stylesheet" href="/assets/styles.css" />
  <title>${title}</title>
</head>`;
}

function header() {
  return `<header class="content-header"><div class="wrap header-inner"><a class="wordmark" href="/" aria-label="TankPicks home">TANKPICKS</a><nav aria-label="Primary"><a href="/">Filter finder</a><a href="/guides/">Guides</a></nav></div></header>`;
}

function sourceList(items) {
  return `<section class="source-list" aria-labelledby="sources-title"><h2 id="sources-title">Manufacturer and primary sources</h2><ul>${items.map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a></li>`).join("")}</ul><p class="updated">Sources reviewed ${updated}. Product specifications can change; verify the current manufacturer page before purchase.</p></section>`;
}

function guidePage(guide) {
  const path = `/guides/${guide.slug}/`;
  const title = `${guide.title} | TankPicks`;
  return `<!doctype html><html lang="en">${head({ title, description: guide.description, path })}<body class="content-page">${header()}<main class="content-main" id="main-content"><div class="wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/guides/">Guides</a></li><li aria-current="page">${guide.title}</li></ol></nav><article class="article"><p class="section-label">Aquarium filter guide</p><h1>${guide.title}</h1><p class="lede">${guide.intro}</p><p class="updated">Reviewed ${updated}</p>${guide.body}${sourceList(guide.sources)}<p><a class="text-link" href="/guides/">Browse all aquarium filter guides</a></p></article></div></main>${footer()}</body></html>`;
}

const guidesIndexDescription = "Practical aquarium filter guides covering filter types, sizing, flow, gentle livestock, reef limitations, large tanks, media, and maintenance.";
const guidesIndex = `<!doctype html><html lang="en">${head({ title: "Aquarium Filter Guides | TankPicks", description: guidesIndexDescription, path: "/guides/", type: "website" })}<body class="content-page">${header()}<main class="content-main" id="main-content"><div class="wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">Guides</li></ol></nav><section class="page-intro"><p class="section-label">TankPicks library</p><h1>Aquarium filter guides</h1><p class="lede">Choose and maintain filtration by understanding published specifications, physical fit, livestock needs, and the work required to keep water moving through clean media.</p></section><div class="guide-grid">${guides.map(guide => `<article class="guide-card"><h2><a href="/guides/${guide.slug}/">${guide.title}</a></h2><p>${guide.description}</p></article>`).join("")}</div></div></main>${footer()}</body></html>`;

const about = `<!doctype html><html lang="en">${head({ title: "About TankPicks", description: "Learn what TankPicks does, what its aquarium filter finder does not claim, and how published specifications are used.", path: "/about/" })}<body class="content-page">${header()}<main class="content-main" id="main-content"><div class="wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">About</li></ol></nav><article class="article"><p class="section-label">About</p><h1>About TankPicks</h1><p class="lede">TankPicks is an aquarium-filter comparison website built to make manufacturer specifications easier to interpret.</p><h2>What the site does</h2><p>The filter finder narrows a catalog using tank volume, water type, livestock sensitivity, stocking level, and preferred installation style. Supporting guides explain the practical decisions that a quiz cannot make: physical fit, flow distribution, maintenance access, reef-system limitations, and media care.</p><h2>What the site does not claim</h2><p>TankPicks has not hands-on tested the products in its catalog. It does not publish star ratings, customer-review summaries, laboratory measurements, veterinary guidance, or professional credentials. A result is a structured comparison of published specifications, not a guarantee that a product will suit every aquarium.</p><h2>How corrections are handled</h2><p>Product names, capacities, and links should point to the identified model or its official manufacturer family page. A model is removed from ranking when the manufacturer does not publish enough information to apply the quiz rules safely. Specifications can change, so visitors should verify the current manufacturer documentation before purchasing.</p><h2>Ownership and contact</h2><p>The site owner has not yet supplied a public owner name, business identity, mailing address, or contact channel. TankPicks does not invent those details. They must be added after the owner provides them.</p><p><a class="text-link" href="/methodology/">Read the full recommendation methodology</a></p></article></div></main>${footer()}</body></html>`;

const methodology = `<!doctype html><html lang="en">${head({ title: "Recommendation Methodology | TankPicks", description: "See how TankPicks filters and ranks aquarium products using manufacturer-published capacity, compatibility, format, and flow information.", path: "/methodology/" })}<body class="content-page">${header()}<main class="content-main" id="main-content"><div class="wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">Methodology</li></ol></nav><article class="article"><p class="section-label">Transparency</p><h1>Recommendation methodology</h1><p class="lede">Rankings use published specifications and quiz answers. TankPicks has not hands-on tested the listed products.</p><h2>Eligibility comes before scoring</h2><p>A product is eligible only when the selected water type is listed in the catalog and the aquarium volume falls inside the manufacturer-published capacity boundary used by TankPicks. The finder does not display an undersized product simply to fill three positions. Tanks over 400 gallons return no match because the current catalog does not provide enough confirmed coverage.</p><h2>How eligible products are ordered</h2><p>The score favors published capacity near a target that changes with the selected stocking level. It then adds limited weighting for the requested filter format, adjustable flow for sensitive livestock, sponge filtration for eligible freshwater gentle-flow setups, and additional published capacity for heavy stocking. The ranking also tries to avoid returning three models from the same product family.</p><h2>What the score does not know</h2><ul><li>Fish species, adult size, feeding amount, and actual waste production</li><li>Displacement from substrate, rock, and decorations</li><li>Measured flow after media, hoses, and head height</li><li>Maintenance quality or interval</li><li>The complete biological, circulation, and nutrient-management design of a reef tank</li></ul><h2>Source policy</h2><p>Capacity, flow, water compatibility, and physical specifications should come from manufacturer product pages, manuals, or catalogs. Retailer-only claims are not used to create a capacity range. For example, the Cascade Max-Flow is excluded from ranking because its manufacturer catalog publishes “150 gallons+” and 820 GPH but not the retailer range previously used by the site.</p><h2>Product images</h2><p>Local product photos are disabled while usage permission is undocumented. Generic filter-format illustrations are shown instead. Product photos should only be enabled after the owner records a source and permission basis for each file.</p><h2 id="affiliate-disclosure">Affiliate status and disclosure</h2><p>Amazon links currently open an untracked search for the exact model name. Affiliate tracking is inactive because no Amazon Associate ID has been provided. If tracking is enabled later, the result page is configured to show: “As an Amazon Associate, TankPicks earns from qualifying purchases.” Commission must not influence eligibility or ranking.</p><div class="callout"><p><strong>Before buying:</strong> verify the exact model, current specifications, fit, price, availability, and intended water type with the manufacturer and seller.</p></div></article></div></main>${footer()}</body></html>`;

const privacy = `<!doctype html><html lang="en">${head({ title: "Privacy Policy | TankPicks", description: "Read how the current TankPicks static website handles data, external links, hosting requests, and future affiliate configuration.", path: "/privacy/" })}<body class="content-page">${header()}<main class="content-main" id="main-content"><div class="wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">Privacy</li></ol></nav><article class="article"><p class="section-label">Privacy</p><h1>Privacy policy</h1><p class="lede">The current TankPicks site is a static website. It has no account system, contact form, advertising scripts, analytics code, or affiliate tracking enabled in this repository.</p><p class="updated">Effective ${updated}</p><h2>Quiz answers</h2><p>Quiz answers are processed in your browser to display filter matches. The site does not send those answers to a TankPicks database, and it does not store them in cookies or browser storage.</p><h2>Hosting data</h2><p>The site is hosted on Vercel. Like other web hosts, Vercel may process request information needed to deliver and secure the site, such as IP address, requested URL, user agent, timestamps, and diagnostic logs. TankPicks does not control Vercel’s independent retention and security practices.</p><h2>External links</h2><p>Manufacturer and retailer links take you to third-party websites. Those sites may collect data under their own privacy policies. Amazon search links are currently untagged. If affiliate tracking is activated later, this policy and the on-page disclosure should be updated before deployment.</p><h2>Cookies and local storage</h2><p>The current TankPicks code does not set cookies and does not use local storage. Third-party sites reached through external links may do so after you leave TankPicks.</p><h2>Personal information and contact</h2><p>TankPicks does not provide a form for submitting personal information. A dedicated privacy contact, owner identity, and mailing address have not yet been supplied by the site owner, so they are not invented here. Do not send sensitive information through the site.</p><h2>Changes</h2><p>This page should be reviewed whenever analytics, forms, advertising, affiliate tags, accounts, or other data-processing features are added. The effective date will be updated when the policy changes.</p></article></div></main>${footer()}</body></html>`;

const outputs = new Map([
  ["guides/index.html", guidesIndex],
  ["about/index.html", about],
  ["methodology/index.html", methodology],
  ["privacy/index.html", privacy],
  ...guides.map(guide => [`guides/${guide.slug}/index.html`, guidePage(guide)])
]);

for (const [relative, html] of outputs) {
  const target = join(root, relative);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, `${html}\n`);
}

const publicPaths = ["/", "/guides/", ...guides.map(guide => `/guides/${guide.slug}/`), "/about/", "/methodology/", "/privacy/"];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicPaths.map(path => `  <url><loc>${site}${path}</loc></url>`).join("\n")}\n</urlset>\n`;
await writeFile(join(root, "sitemap.xml"), sitemap);

console.log(`Generated ${outputs.size} pages and sitemap.xml`);
