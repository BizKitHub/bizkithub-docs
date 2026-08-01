---
id: "EmHNQpk5UHan3f5c"
category: "crm/contacts"
tags: []
published_at: "2026-04-24T06:57:25.835Z"
---


Contacts
========

Kontakty jsou jádrem každé zákaznicky orientované organizace — představují jednotnou evidenci všech osob a firem, se kterými komunikujete nebo obchodujete. Modul `/contact` proto sdružuje registrované účty, hosty vzniklé při jednorázových objednávkách, firemní partnery, testovací účty i archivované záznamy do jediného přehledu, na který navazují objednávky, reklamace, newslettery, kredit i historie e-mailové komunikace. Díky tomu není kontakt jen řádkem v databázi, ale živým profilem, v němž se sbíhá celý zákaznický vztah.
## Přehled kontaktů
Hlavní stránka je postavena jako pracovní nástroj pro denní správu zákaznické základny. Tabulka proto v každém řádku ukazuje nejen identifikaci osoby, ale také obchodní kontext — kolik peněz už zákazník utratil, jaké je jeho skóre spolehlivosti a kdy byl v systému naposledy aktivní. Tyto informace umožňují rychle rozlišit klíčového klienta od jednorázového hosta bez nutnosti otevírat detail.
Jednotlivé sloupce sdělují:
- **Jméno** — plné jméno osoby, případně název firmy.
- **E-mail** — primární adresa pro přihlášení i veškerou komunikaci.
- **Telefon** — formátovaný podle národních pravidel pro snadnou čitelnost.
- **Kredit** — aktuální zůstatek vedený paralelně v kreditech i v peněžní hodnotě.
- **Skóre důvěryhodnosti** — automaticky vypočtené hodnocení kvality zákazníka v rozsahu 0 až 100.
- **Datum registrace** — okamžik, kdy kontakt v systému vznikl.
- **Newsletter** — aktuální stav přihlášky k odběru (schválen, čekání, zrušeno nebo ignorováno).
- **Tržby** — celoživotní útrata z uhrazených objednávek.
- **Počet objednávek** — součet nových, rozpracovaných, zaplacených a dokončených případů.
- **Refundy** — souhrnná hodnota vrácených nebo stornovaných položek.
- **Poslední aktivita** — čas posledního přihlášení nebo významné akce.
Tabulka se automaticky obnovuje každých 5 sekund, takže odráží stav co nejblíže reálnému času. Na mobilních zařízeních se přepíná na zhuštěný náhled, který ponechává jen nejdůležitější údaje.
## Filtrování a hledání
Protože zákaznická databáze typicky roste do tisíců záznamů, je seznam vybaven kombinací filtrů, které lze vrstvit — každý zvolený filtr výběr dále zužuje. Díky tomu lze během okamžiku izolovat například „VIP zákazníky z Česka s kladným kreditem přihlášené k newsletteru".
K dispozici jsou tyto filtrační osy:
- **Registrovaný / host** — registrovaný kontakt má nastavené heslo a vlastní účet, zatímco host vznikl bez registrace.
- **Prémiová verze** — označení VIP zákazníků se zvláštními podmínkami.
- **Blokace** — zákaz přístupu do uživatelského portálu.
- **Testovací účet** — neprodukční kontakty vyloučené z obchodních přehledů.
- **Stav kreditu** — kladný zůstatek, nula, případně dluh.
- **Přihlášení k newsletteru** — filtr podle stavu odběru.
- **Datum registrace a poslední aktivity** — libovolný časový rozsah.
- **Jazyková mutace** — CZ, SK, EN a další jazyky komunikace.
Fulltextové hledání pokrývá jméno, e-mail, telefon i název firmy a ignoruje diakritiku i velikost písmen, takže „Novak", „novák" i „NOVÁK" vrátí stejný výsledek.
> 💡 Kontakty lze navíc seskupovat do vlastních tagů („VIP", „Velkoobchod", „Ambasadoři"). Filtr přijímá více skupin najednou; speciální hodnota „Bez tagů" najde kontakty bez jakéhokoli označení.
## Jak funguje skóre důvěryhodnosti
Skóre důvěryhodnosti je celé číslo v rozsahu 0 až 100, které systém kontinuálně přepočítává z chování zákazníka. Vyjadřuje, jak spolehlivý obchodní partner daný kontakt je — vyšší hodnota znamená lepšího zákazníka. Skóre nelze upravit ručně; jde o odvozenou metriku, která má sloužit jako objektivní podklad pro rozhodnutí typu „komu nabídnout zvýhodněnou platbu na fakturu".
Do výpočtu vstupuje kombinace faktorů:
- **Stáří účtu** — účty starší než rok získávají 20 bodů, starší než půl roku 10 bodů, novější 5 bodů.
- **Poměr uhrazených objednávek** — zákazník platící více než 90 % objednávek získá bonus 20 bodů; dlouhodobě nízká platební morálka pod 50 % znamená srážku 10 bodů.
- **Kredit** — kladný zůstatek přičítá 10 bodů, záporný zůstatek odebírá 5 bodů.
- **Prémiový status** — VIP zákazníci mají bonus 10 bodů.
- **Registrace** — kontakt s vlastním účtem získává 5 bodů navíc oproti hostovi.
- **Stornované objednávky** — více než 5 storn znamená srážku 15 bodů, mezi 3 a 5 storny srážku 5 bodů.
> ℹ️ Blokovaný kontakt má skóre nastaveno na hodnotu −1 a je automaticky vyloučen ze všech přehledů a výběrových kampaní.
## Registrovaný kontakt vs. host
V systému žijí vedle sebe dva typy kontaktů, které se liší hloubkou zákaznického vztahu. Registrovaný kontakt má nastavené heslo, samostatný profil a přístup do uživatelského portálu, kde si může prohlížet historii objednávek a spravovat své údaje; za registraci navíc získává 5 bodů ke skóre. Host (anonymní zákazník) naopak vzniká automaticky při první objednávce bez registrace — do portálu se nedostane, ale historii mu systém stejně párování podle e-mailové adresy. Host se může kdykoli proměnit v registrovaný účet pouhým nastavením hesla, aniž by o cokoli z dosavadní historie přišel.
> 💡 Pokud vznikne duplicitní kontakt (například ručně založený v administraci a zároveň automaticky z objednávky), lze oba záznamy sloučit akcí **Sloučit zákazníky** — objednávky, kredit i veškerá historie přejdou na hlavní účet.
## Blokace a testovací účty
Blokace slouží jako ostré opatření proti problematickým zákazníkům. Zakáže kontaktu přístup do portálu, zablokuje mu newsletter i zasílání automatických zpráv a při aktivaci lze zadat důvod, který zůstane v auditním záznamu. Akce je plně vratná — blokaci lze kdykoli zrušit. Testovací účet je oproti tomu čistě administrativní příznak pro interní QA a integrační testy; takový kontakt je automaticky skrytý v reportech, kampaních i statistikách, takže netvoří šum v obchodních datech.
> ⚠️ Blokace se projeví okamžitě. Pokud má zákazník otevřené přihlášení v mobilu či prohlížeči, lze ho navíc vynuceně odhlásit akcí **Zneplatnit relace** — musí se pak přihlásit znovu, což se mu už samozřejmě nepodaří.
## Kredit
Kredit je interní platební prostředek, kterým lze u zákazníka držet předplacené prostředky, bonusy za loajalitu, dobropisy nebo dárkové vouchery. V systému je veden ve dvou paralelních hodnotách: jako **počet kreditů** (celé kladné nebo záporné číslo) a jako **peněžní ekvivalent** v měně organizace, který slouží pro účetní přehledy. Díky tomuto dvojímu vedení lze v účetnictví zobrazit skutečnou hodnotu závazku vůči zákazníkovi, i když se kredity samy používají jako univerzální jednotka.
V detailu kontaktu je k dispozici:
- **Aktuální zůstatek** — okamžitý stav počtu kreditů i peněžní hodnoty.
- **Historie transakcí** — seřazená od nejnovější, s autorem a důvodem změny.
- **Vazba na objednávku** — u každé transakce je jasné, ve které objednávce byl kredit použit nebo vygenerován.
- **Volitelná platnost** — kredit může mít datum expirace, po kterém se nevyčerpaný zůstatek odepisuje.
Ruční přidání kreditu provádí obsluha přes akci **Přidat kredit** v detailu. Každý záznam obsahuje částku, popis, autora změny a je uložen do auditního protokolu.
> ℹ️ Pro platbu objednávky systém vždy používá poměr 1 kredit = 1 jednotka měny. Peněžní hodnota je pouze účetní evidencí a může se od počtu kreditů lišit — například u dárkových voucherů, které měly nulovou pořizovací cenu.
## Měsíční limity čerpání
Každý kontakt má dva nezávislé limity pro maximální čerpání kreditu v kalendářním měsíci, které umožňují předejít nekontrolovanému vyčerpání zůstatku. **Měkký limit** při překročení zobrazí obsluze varování, ale transakci nezablokuje, zatímco **tvrdý limit** další čerpání rovnou zastaví a pro pokračování je nutné ruční schválení. Nulová hodnota v kterémkoli poli znamená, že daný limit není aktivní.
## Historie objednávek
Každá objednávka se automaticky eviduje u kontaktu a tvoří základ pro analytiku — tržby, počet objednávek, refundy, první a poslední objednávku. Systém tato čísla materializuje do takzvaného čteného modelu, který se obnovuje při každé změně stavu objednávky. Díky tomu jsou přehledy tržeb a retence okamžitě k dispozici bez nutnosti opětovného počítání přes tisíce řádků.
## Organizační hierarchie
Kontakty lze propojit vztahem nadřízený–podřízený a vytvořit tak organizační strom — typicky pro firemní zákazníky, kde existuje mateřská firma a její pobočky, nebo pro rodinné účty. Každý kontakt má nejvýše jednoho přímého nadřízeného a libovolný počet podřízených.
V detailu se hierarchie zobrazuje ve čtyřech úrovních:
- **Nadřízený** — přímý rodič v hierarchii, kliknutím se přejde na jeho profil.
- **Podřízení** — přímí potomci daného kontaktu.
- **Kolegové** — kontakty sdílející stejného nadřízeného.
- **Organizační strom** — vizualizace ve stylu Microsoft Teams s ancestory i celým podstromem.
Maximální hloubka stromu je 32 úrovní v každém směru a systém hlídá, aby nevznikl cyklus (rodič nemůže být zároveň potomkem svého potomka).
## Vlastní pole (custom fields)
Každá organizace má svá specifika — někdo potřebuje evidovat velikost firmy, jiný IČO dodavatele nebo preferovanou velikost oblečení. Pro tyto případy lze k libovolnému kontaktu připojit vlastní pole typu text, číslo nebo výběr. Pole mohou být povinná, mohou mít nápovědu, zástupný text a regulární výraz pro validaci. Hodnoty se pak u kontaktů ukládají a zobrazují přímo v detailu vedle standardních údajů.
## Proces hromadného importu
Hromadný import slouží k rychlému založení desítek až tisíců kontaktů — typicky po akci, veletrhu nebo při migraci ze starého systému. Průvodce vede obsluhu krok za krokem a zaručuje, že nevzniknou duplicity:
1. **Vložení dat** — seznam e-mailů, případně i jmen, ručně nebo přes CSV.
2. **Parsování** — systém automaticky rozdělí e-mail a jméno, očistí diakritiku a kapitalizuje křestní jméno i příjmení.
3. **Kontrola duplicit** — porovnání s existujícími kontakty organizace; duplicitní e-maily se přeskakují.
4. **Náhled a potvrzení** — obsluha vidí počet nových a přeskočených záznamů a může doplnit interní poznámku ke všem importovaným kontaktům.
5. **Dokončení** — kontakty se založí s výchozím jazykem organizace a bez hesla, tedy jako hosté.
> 💡 Do interní poznámky při importu doporučujeme zapsat zdroj dat (například „Veletrh 2026-03") — později podle ní skupinu snadno dohledáte a můžete ji oslovit cílenou kampaní.
## Relace, hesla a API klíče
Detail kontaktu obsahuje samostatnou sekci věnovanou bezpečnosti přihlášení. Obsluha zde vidí aktivní relace, může vynuceně odhlásit konkrétní zařízení, prohlédnout si protokol změn hesla a v případě potřeby vygenerovat reset. U technicky zaměřených kontaktů jsou navíc k dispozici API klíče a pracovní prostory (workspaces), barevně odlišené podle prostoru.
Konkrétně zde najdete:
- **Relace** — seznam přihlášených zařízení s možností vynuceného odhlášení.
- **Protokol změny hesla** — datumy všech změn hesla (nikoli hashe samotné).
- **Reset hesla** — vygeneruje jednorázový odkaz a zašle ho na e-mail kontaktu.
- **API klíče a pracovní prostory** — klíče pro technické integrace, barevně rozlišené podle prostoru.
## Souhlasy (consents)
Systém odděleně eviduje souhlasy s odběrem newsletteru, marketingovou komunikací a zpracováním osobních údajů podle GDPR. Každá změna — tedy udělení nebo odvolání souhlasu — se ukládá s časovým razítkem, zdrojem (administrátor / web) a volitelnou poznámkou, takže je kdykoli doložitelné, kdy a jakým způsobem souhlas vznikl nebo zanikl.
## Mazání s důvodem
Smazání kontaktu z kontextového menu řádku je takzvaně měkké — kontakt zůstane uložen, ale je skryt ze všech přehledů a nelze ho znovu použít pro přihlášení. Při mazání je vždy vyžadován **důvod**, který se uloží do auditního záznamu. Tento mechanismus chrání historii a umožňuje audit, kdo a proč kontakt odstranil.
> ⚠️ Kontakt nelze smazat opakovaně a obnovení smazaného záznamu již není dostupné v běžné administraci. Pokud potřebujete kontakt vrátit, obraťte se na technickou podporu.
## Akce v řádku
Přímo z přehledu lze bez otevírání detailu provést několik operací, které šetří čas při rutinní práci. Kontextové menu řádku nabízí:
- **Otevřít detail** — kompletní profil zákazníka se všemi záložkami.
- **Přidat kredit** — rychlá úprava zůstatku s povinným uvedením důvodu.
- **Blokovat / odblokovat** — okamžitá změna přístupu do portálu.
- **Zneplatnit relace** — nucené odhlášení zákazníka ze všech zařízení.
- **Smazat kontakt** — měkké smazání s povinným důvodem.

Contacts are the core of every customer-oriented organization — they represent a unified record of all individuals and companies you communicate or do business with. The `/contact` module therefore brings together registered accounts, guests created during one-time orders, business partners, test accounts, and archived records into a single overview, which is followed by orders, complaints, newsletters, credit, and email communication history. Thanks to this, a contact is not just a row in a database, but a living profile where the entire customer relationship converges.
## Contact Overview
The main page is designed as a working tool for daily management of the customer base. The table therefore shows not only the person's identification in each row, but also the business context — how much money the customer has already spent, their reliability score, and when they were last active in the system. This information allows you to quickly distinguish a key client from a one-time guest without having to open the detail.
Individual columns state:
- **Name** — full name of the person, or company name.
- **Email** — primary address for login and all communication.
- **Phone** — formatted according to national rules for easy readability.
- **Credit** — current balance maintained in parallel in credits and monetary value.
- **Trust Score** — automatically calculated customer quality rating in the range of 0 to 100.
- **Registration Date** — the moment the contact was created in the system.
- **Newsletter** — current subscription status (approved, pending, cancelled, or ignored).
- **Revenue** — lifetime spending from paid orders.
- **Number of Orders** — sum of new, in-progress, paid, and completed cases.
- **Refunds** — total value of returned or cancelled items.
- **Last Activity** — time of last login or significant action.
The table automatically refreshes every 5 seconds, reflecting the status as close to real-time as possible. On mobile devices, it switches to a condensed view, showing only the most important data.
## Filtering and Searching
Because customer databases typically grow to thousands of records, the list is equipped with a combination of filters that can be layered — each selected filter further narrows the selection. This allows you to instantly isolate, for example, "VIP customers from the Czech Republic with positive credit who are subscribed to the newsletter".
The following filtering axes are available:
- **Registered / Guest** — a registered contact has a password set and their own account, while a guest was created without registration.
- **Premium Status** — designation for VIP customers with special conditions.
- **Blocking** — prohibition of access to the user portal.
- **Test Account** — non-production contacts excluded from business overviews.
- **Credit Status** — positive balance, zero, or debt.
- **Newsletter Subscription** — filter by subscription status.
- **Registration Date and Last Activity** — any time range.
- **Language Version** — CZ, SK, EN, and other communication languages.
Full-text search covers name, email, phone, and company name, and ignores diacritics and case, so "Novak", "novák", and "NOVÁK" will return the same result.
> 💡 Contacts can also be grouped into custom tags ("VIP", "Wholesale", "Ambassadors"). The filter accepts multiple groups at once; the special value "No Tags" finds contacts without any designation.
## How the Trust Score works
The trust score is an integer between 0 and 100, which the system continuously recalculates based on customer behavior. It expresses how reliable a business partner the given contact is — a higher value means a better customer. The score cannot be adjusted manually; it is a derived metric intended to serve as an objective basis for decisions such as "who to offer preferential invoice payment to".
A combination of factors is included in the calculation:
- **Account Age** — accounts older than one year receive 20 points, older than six months 10 points, newer 5 points.
- **Paid Order Ratio** — a customer paying more than 90% of orders receives a 20-point bonus; persistently low payment discipline below 50% means a 10-point deduction.
- **Credit** — a positive balance adds 10 points, a negative balance subtracts 5 points.
- **Premium Status** — VIP customers receive a 10-point bonus.
- **Registration** — a contact with their own account receives an additional 5 points compared to a guest.
- **Cancelled Orders** — more than 5 cancellations means a 15-point deduction, between 3 and 5 cancellations a 5-point deduction.
> ℹ️ A blocked contact has its score set to -1 and is automatically excluded from all overviews and selection campaigns.
## Registered Contact vs. Guest
Two types of contacts coexist in the system, differing in the depth of the customer relationship. A registered contact has a password set, a separate profile, and access to the user portal, where they can view order history and manage their data; registration also earns them 5 points towards their score. A guest (anonymous customer), on the other hand, is automatically created during their first order without registration — they cannot access the portal, but the system still pairs their history based on their email address. A guest can turn into a registered account at any time simply by setting a password, without losing any of their existing history.
> 💡 If a duplicate contact is created (for example, manually created in the administration and also automatically from an order), both records can be merged using the **Merge Customers** action — orders, credit, and all history will be transferred to the main account.
## Blocking and Test Accounts
Blocking serves as a strict measure against problematic customers. It denies the contact access to the portal, blocks their newsletter and automatic messages, and upon activation, a reason can be entered, which will remain in the audit log. The action is fully reversible — blocking can be cancelled at any time. A test account, on the other hand, is purely an administrative flag for internal QA and integration tests; such a contact is automatically hidden in reports, campaigns, and statistics, thus not creating noise in business data.
> ⚠️ Blocking takes effect immediately. If the customer has an open login on a mobile device or browser, they can also be forcibly logged out using the **Invalidate Sessions** action — they will then have to log in again, which, of course, they will no longer be able to do.
## Credit
Credit is an internal payment method that can be used to hold prepaid funds, loyalty bonuses, credit notes, or gift vouchers for a customer. In the system, it is maintained in two parallel values: as **number of credits** (a whole positive or negative number) and as a **monetary equivalent** in the organization's currency, which serves for accounting overviews. Thanks to this dual tracking, the actual value of the liability to the customer can be shown in accounting, even if the credits themselves are used as a universal unit.
In the contact detail, the following are available:
- **Current Balance** — instant status of both the number of credits and monetary value.
- **Transaction History** — sorted from newest, with author and reason for change.
- **Order Link** — for each transaction, it is clear in which order the credit was used or generated.
- **Optional Validity** — credit can have an expiration date, after which the unused balance is written off.
Manual credit addition is performed by the operator via the **Add Credit** action in the detail. Each record includes the amount, description, author of the change, and is stored in the audit log.
> ℹ️ For order payment, the system always uses a ratio of 1 credit = 1 unit of currency. The monetary value is only for accounting records and may differ from the number of credits — for example, with gift vouchers that had a zero acquisition cost.
## Monthly Usage Limits
Each contact has two independent limits for maximum credit usage in a calendar month, which prevent uncontrolled depletion of the balance. A **soft limit** displays a warning to the operator when exceeded, but does not block the transaction, while a **hard limit** stops further usage immediately, and manual approval is required to continue. A zero value in any field means that the limit is not active.
## Order History
Every order is automatically recorded with the contact and forms the basis for analytics — revenue, number of orders, refunds, first and last order. The system materializes these numbers into a so-called read model, which is refreshed with every change in order status. Thanks to this, revenue and retention overviews are immediately available without the need for recalculation across thousands of rows.
## Organizational Hierarchy
Contacts can be linked by a superior-subordinate relationship to create an organizational tree — typically for corporate customers where there is a parent company and its branches, or for family accounts. Each contact has at most one direct superior and any number of subordinates.
In the detail, the hierarchy is displayed at four levels:
- **Superior** — direct parent in the hierarchy, clicking on it goes to their profile.
- **Subordinates** — direct descendants of the given contact.
- **Colleagues** — contacts sharing the same superior.
- **Organizational Tree** — Microsoft Teams-style visualization with ancestors and the entire subtree.
The maximum tree depth is 32 levels in each direction, and the system ensures that no cycles are created (a parent cannot also be a descendant of their own descendant).
## Custom Fields
Every organization has its specific needs — some need to record company size, others a supplier's Company ID or preferred clothing size. For these cases, custom fields of type text, number, or selection can be attached to any contact. Fields can be mandatory, can have a hint, placeholder text, and a regular expression for validation. The values are then stored and displayed for contacts directly in the detail alongside standard data.
## Bulk Import Process
Bulk import serves for quickly creating tens to thousands of contacts — typically after an event, trade fair, or during migration from an old system. The wizard guides the operator step by step and ensures that no duplicates are created:
1. **Data Entry** — list of emails, and optionally names, manually or via CSV.
2. **Parsing** — the system automatically separates email and name, cleans diacritics, and capitalizes first and last names.
3. **Duplicate Check** — comparison with existing contacts in the organization; duplicate emails are skipped.
4. **Preview and Confirmation** — the operator sees the number of new and skipped records and can add an internal note to all imported contacts.
5. **Completion** — contacts are created with the organization's default language and without a password, i.e., as guests.
> 💡 When importing, we recommend writing the data source in the internal note (for example, 'Trade Fair 2026-03') — later you can easily find the group by it and target them with a specific campaign.
## Sessions, Passwords, and API Keys
The contact detail includes a separate section dedicated to login security. The operator can see active sessions, forcibly log out a specific device, view the password change log, and generate a reset if needed. For technically oriented contacts, API keys and workspaces are also available, color-coded by workspace.
Specifically, you will find here:
- **Sessions** — a list of logged-in devices with the option of forced logout.
- **Password Change Log** — dates of all password changes (not the hashes themselves).
- **Password Reset** — generates a one-time link and sends it to the contact's email.
- **API Keys and Workspaces** — keys for technical integrations, color-coded by workspace.
## Consents
The system separately records consents for newsletter subscription, marketing communication, and personal data processing according to GDPR. Every change — meaning granting or revoking consent — is stored with a timestamp, source (administrator / web), and an optional note, making it verifiable at any time when and how consent was given or withdrawn.
## Deletion with Reason
Deleting a contact from the row's context menu is a so-called soft delete — the contact remains stored but is hidden from all overviews and cannot be used for login again. A **reason** is always required when deleting, which is saved in the audit log. This mechanism protects history and allows auditing of who deleted the contact and why.
> ⚠️ A contact cannot be deleted repeatedly, and restoring a deleted record is no longer available in the regular administration. If you need to restore a contact, please contact technical support.
## In-row Actions
Several operations can be performed directly from the overview without opening the detail, saving time during routine work. The row's context menu offers:
- **Open Detail** — complete customer profile with all tabs.
- **Add Credit** — quick balance adjustment with a mandatory reason.
- **Block / Unblock** — immediate change of access to the portal.
- **Invalidate Sessions** — forced logout of the customer from all devices.
- **Delete Contact** — soft delete with a mandatory reason.
