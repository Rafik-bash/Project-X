# ميزون كلير: Iraqi Arabic copy reference

Dialect: Baghdadi, warm but polished. Headings lean neutral, helper text and quotes lean dialect. No emoji, no em dashes.
Brand string is the literal `ميزون كلير` everywhere, so it can be found and replaced when the real name arrives.
Digits: Arabic-Indic (٠١٢٣٤٥٦٧٨٩), thousands separator `٬`, decimal `٫`. Money: `٨٥٬٠٠٠ د.ع`.

## Hero headline

**Chosen:** ادخل. خذ نفَس. بيتك رجع *جديد.*
(the swash underline sits on «جديد.»; brand line «بيتك، يرجع جديد» repeats in the title, OG, process step 4 and the CTA band)

Alternates:
1. ارجع لبيت أهدأ، و*أنظف.*
2. إحنا ننظف، وإنت ترجعلك *جمعتك.* (localizes "get your Saturday back" to the Iraqi Friday off)

## JS strings (js/booking.js)

### Service names (`SERVICES[*].name`)
| English | Iraqi Arabic |
|---|---|
| Standard clean | تنظيف أساسي |
| Deep clean | تنظيف عميق |
| Move in / move out | تنظيف نقل بيت |
| Post-renovation | تنظيف بعد الترميم |

The cards on the page show the short forms «نقل بيت» and «بعد الترميم». The JS names include «تنظيف» so the confirmation sentence reads «حجزنالك تنظيف نقل بيت يوم…».

### Extras (`EXTRAS[*].name`)
| English | Iraqi Arabic |
|---|---|
| Inside oven | جوه الفرن |
| Inside fridge | جوه الثلاجة |
| Interior windows | الشبابيك من جوه |
| Laundry & fold | غسل الهدوم وطيّها |

### Summary and size
| English | Iraqi Arabic |
|---|---|
| Studio | ستوديو |
| `{n} bed · {n} bath` | `{bed} · {bath}` with the counted forms below |
| Oven & fridge included | الفرن والثلاجة مشمولين |
| None | ماكو |
| Not chosen yet | بعدك ما اخترت |
| Not added yet | بعده ما انضاف |

Counted forms (Arabic has a dual, so branch on n):
- Bedrooms: 1 `غرفة نوم وحدة` · 2 `غرفتين نوم` · 3+ `{n} غرف نوم`
- Bathrooms: 1 `حمّام واحد` · 2 `حمّامين` · 3+ `{n} حمّامات`
- Example: `غرفتين نوم · حمّام واحد`

### Duration and team: `About {h} hours · {n} cleaner(s)`
Pattern: `بحدود {hours} · {team}`
- Hours (`fmtHours`): 1 `ساعة وحدة` · 2 `ساعتين` · 3–10 `{n} ساعات` · 11+ `{n} ساعة`. Half hours: add `ونص`, e.g. 2.5 `ساعتين ونص`, 3.5 `٣ ساعات ونص`, 0.5 `نص ساعة`.
- Team: 1 `شخص واحد` · 2 `شخصين` · 3–10 `{n} أشخاص`
- Examples: `بحدود ٣ ساعات ونص · شخص واحد`, `بحدود ٥ ساعات · شخصين`

### Time slots
| English | Iraqi Arabic |
|---|---|
| `done by ~{time}` | `يخلص بحدود {time}` |
| Booked | محجوز |

Time format (`to12h`): `{h}` or `{h}:{mm}` plus a part of day, no am/pm: before 12 `الصبح`, 12–14 `الظهر`, 15–17 `العصر`, 18+ `المسا`. Examples: `٨ الصبح`, `٩:٣٠ الصبح`, `١٢ الظهر`, `٤ العصر`, `٧ المسا`.

### Live-region announcements
| English | Iraqi Arabic |
|---|---|
| `{day} selected. {n} arrival times available.` | `اخترت {day}. اكو {n} أوقات وصول متوفرة.` |
| (n = 0) | `اخترت {day}. ماكو أوقات وصول متوفرة.` |
| (n = 1) | `اخترت {day}. اكو وقت وصول واحد متوفر.` |
| (n = 2) | `اخترت {day}. اكو وقتين وصول متوفرين.` |
| (n ≥ 11) | `اخترت {day}. اكو {n} وقت وصول متوفر.` |
| `{time} isn't available that day. Choose another time.` | `{time} مو متوفر بذاك اليوم. اختار وقت ثاني.` |
| `Estimate {price}, about {hours}.` | `المجموع التقريبي {price}، بحدود {hours}.` |
| `{Service} selected.` | `اخترت {service}.` |
| `Booking reference copied.` | `نسخنا رقم الحجز.` |

### Buttons and counters
| English | Iraqi Arabic |
|---|---|
| Copied | تم النسخ |
| `{n} characters left` | `باقيلك {n} حرف` |

### Calendar file (ICS)
| English | Iraqi Arabic |
|---|---|
| SUMMARY `{Brand}: {service}` | `ميزون كلير: {service}` |
| `Booking {ref}` | `الحجز {ref}` |
| `Extras:` | `الإضافات:` |
| `Estimated total:` | `المجموع التقريبي:` |
| `Notes:` | `ملاحظات:` |
| Alarm `{Brand} visits tomorrow` | `فريق ميزون كلير جايكم باچر` |

### Other JS strings found (not in the brief, same voice)
| Where | English | Iraqi Arabic |
|---|---|---|
| main.js menu label | Open menu / Close menu | افتح القائمة / سكّر القائمة |
| slider.js aria-valuetext | `{n}% before, {m}% after` | `{n}٪ قبل، {m}٪ بعد` |
| slider.js | Showing before only / Showing after only | بس «قبل» / بس «بعد» |
| booking.js day label states | available / fully booked / closed / unavailable / , selected | متوفر / محجوز بالكامل / عطلة / مو متاح / ، مختار |
| booking.js stepper output | Studio | ستوديو |

### Formatting notes for the engineer
- Numbers: `new Intl.NumberFormat('ar-IQ')` gives Arabic-Indic digits and `٬`. For money, format the number and append ` د.ع` rather than using `style: 'currency'` (that adds extra marks after «د.ع»).
- Dates: `Intl.DateTimeFormat('ar-IQ', …)` uses the Iraqi month names (كانون الثاني، شباط…), which is what Baghdad readers expect.
- The calendar header in index.html now starts on **Saturday** (سبت … جمعة). The grid builder in booking.js has to use the same Saturday-first offset.
- Wrap Latin values (email, booking ref) in `<bdi>` when injecting them into Arabic sentences, e.g. `[data-confirm="email"]` and `[data-confirm="ref"]`.
- Friday is the day off in the footer hours («الجمعة: عطلة»), so the availability data should treat Friday as closed.
