import './style.css';
import { store } from './store.js';
import { t, translations } from './i18n.js';
import { items } from './data.js';
import { calculateResults } from './calculator.js';
import * as XLSX from 'xlsx';

// --- Components ---

function Header(state) {
  const flagCodes = {
    ar: 'sa',
    en: 'gb',
    ur: 'pk',
    tr: 'tr',
    hi: 'in',
    id: 'id',
    ms: 'my'
  };

  const langNames = {
    ar: 'العربية',
    en: 'English',
    ur: 'اردو',
    tr: 'Türkçe',
    hi: 'हिन्दी',
    id: 'Indonesia',
    ms: 'Melayu'
  };

  return `
    <header class="bg-white/90 backdrop-blur shadow-md relative z-10 border-b border-accent-500/30">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold text-primary-600 flex items-center gap-2 cursor-pointer font-arabic" onclick="window.app.setStep('welcome')">
          <span>🕌</span> ${t('title', state.lang)}
        </h1>
        <select id="lang-select" class="border rounded px-3 py-2 text-sm bg-primary-50 text-primary-700 outline-none focus:ring-1 focus:ring-accent-500">
          ${Object.keys(translations).map(l =>
    `<option value="${l}" ${state.lang === l ? 'selected' : ''} data-flag="${flagCodes[l]}">${langNames[l]}</option>`
  ).join('')}
        </select>
      </div>
    </header>
  `;
}

function WelcomeScreen(state, shouldAnimate = true) {
  const isRtl = state.lang === 'ar' || state.lang === 'ur';
  const arrowNext = isRtl ? '←' : '→';

  return `
    <div class="max-w-3xl mx-auto text-center space-y-8 py-12 px-4 ${shouldAnimate ? 'animate-fade-in' : ''} relative">
      <!-- Background Pattern Overlay -->
      <div class="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none z-0"></div>
      
      <div class="bg-white/95 p-8 rounded-2xl shadow-xl border-2 border-accent-500/20 relative z-10 overflow-hidden">
        
        <!-- Quran Art Hero -->
        <div class="w-full h-48 mb-6 rounded-xl bg-primary-700 flex items-center justify-center overflow-hidden border border-accent-500/40 shadow-inner">
             <img src="/hero_art.png" class="w-full h-full object-cover opacity-90 hover:scale-105 transition duration-700 ease-in-out" alt="Islamic Art" />
        </div>

        <div class="text-accent-600 mb-3 font-arabic text-sm">
          بسم الله الرحمن الرحيم
        </div>
        
        <div class="text-accent-600 mb-3 font-arabic text-xl leading-relaxed">
          ﴿ قَدْ أَفْلَحَ مَنْ تَزَكَّىٰ وَذَكَرَ اسْمَ رَبِّهِ فَصَلَّى ﴾
        </div>
        
        <div class="text-accent-600 mb-4 font-arabic text-sm">
          صدق الله العظيم
        </div>
        
        <h2 class="text-4xl font-bold text-primary-700 mb-4 font-arabic tracking-wide">${t('title', state.lang)}</h2>
        
        <p class="text-gray-600 text-lg mb-8 leading-relaxed font-light font-arabic">
          ${t('welcome_message', state.lang)}
        </p>
        
        <button onclick="window.app.setStep('wizard-1')" 
          class="bg-accent-500 hover:bg-accent-600 text-white font-bold py-4 px-12 rounded-full shadow-lg transition transform hover:scale-105 active:scale-95 border-2 border-white ring-2 ring-accent-500/30">
          ${t('next', state.lang)} ${arrowNext}
        </button>
      </div>
    </div>
  `;
}

function WizardStep1(state, shouldAnimate = true) {
  const isRtl = state.lang === 'ar' || state.lang === 'ur';
  const arrowBack = isRtl ? '→' : '←';
  const arrowNext = isRtl ? '←' : '→';

  return `
    <div class="max-w-4xl mx-auto py-8 px-4 ${shouldAnimate ? 'animate-fade-in' : ''} relative z-10">
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4 text-primary-700 font-arabic">${t('select_items', state.lang)}</h2>
        <div class="flex gap-2 mb-6">
          <div class="h-2 w-1/3 bg-accent-500 rounded"></div>
          <div class="h-2 w-1/3 bg-gray-200 rounded"></div>
          <div class="h-2 w-1/3 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${items.map(item => {
    const isSelected = state.selectedItems.includes(item.id);
    return `
            <label class="cursor-pointer group relative hover:-translate-y-1 transition duration-300">
              <input type="checkbox" class="hidden item-checkbox" value="${item.id}" ${isSelected ? 'checked' : ''}>
              <div class="p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 h-full relative overflow-hidden
                ${isSelected ? 'border-accent-500 bg-primary-50 shadow-md' : 'border-gray-200 hover:border-accent-300 bg-white shadow-sm'}">
                
                ${isSelected ? '<div class="absolute top-0 left-0 w-1 h-full bg-accent-500"></div>' : ''}
                
                <div class="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 transition-colors
                  ${isSelected ? 'bg-accent-500 border-accent-500' : 'bg-white group-hover:border-accent-300'}">
                  ${isSelected ? '<span class="text-white text-sm font-bold">✓</span>' : ''}
                </div>
                <div>
                  <div class="font-bold text-gray-800 text-lg font-arabic">${t(item.id, state.lang)}</div>
                  <div class="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-1">
                    ${t(item.category, state.lang)}
                  </div>
                </div>
              </div>
            </label>
          `;
  }).join('')}
      </div>

      <div class="mt-8 flex justify-between items-center border-t border-gray-200 pt-6">
        <button onclick="window.app.setStep('welcome')" class="text-gray-500 hover:text-primary-700 font-medium px-6 py-3 transition">
          ${arrowBack} ${t('back', state.lang)}
        </button>
        <button onclick="window.app.setStep('wizard-2')" 
          class="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
          ${t('next', state.lang)} ${arrowNext}
        </button>
      </div>
    </div>
  `;
}

function WizardStep2(state, shouldAnimate = true) {
  const selected = items.filter(i => state.selectedItems.includes(i.id));
  const isRtl = state.lang === 'ar' || state.lang === 'ur';
  const arrowBack = isRtl ? '→' : '←';
  const arrowNext = isRtl ? '←' : '→';

  return `
    <div class="max-w-3xl mx-auto py-8 px-4 ${shouldAnimate ? 'animate-fade-in' : ''} relative z-10">
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4 text-primary-700 font-arabic">${t('market_prices', state.lang)}</h2>
        <div class="flex gap-2 mb-6">
          <div class="h-2 w-1/3 bg-primary-200 rounded"></div>
          <div class="h-2 w-1/3 bg-accent-500 rounded"></div>
          <div class="h-2 w-1/3 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-lg border-2 border-gray-100 divide-y divide-gray-100 overflow-hidden">
        <div class="bg-primary-50 p-4 hidden md:flex justify-between items-center text-primary-900 border-b border-gray-200 text-xs uppercase tracking-wider font-bold font-arabic">
          <div style="${isRtl ? 'margin-right: 56px;' : 'margin-left: 56px;'}">${t('item_name', state.lang)}</div>
          <div class="w-40 text-center">${t('price_per_kg', state.lang)}</div>
        </div>
        ${selected.map(item => {
    const price = state.prices[item.id] || '';
    return `
            <div class="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-primary-50/50 transition duration-300">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-primary-200">
                  ${t(item.id, state.lang).charAt(0)}
                </div>
                <div>
                  <div class="font-bold text-gray-800 text-lg font-arabic">${t(item.id, state.lang)}</div>
                  <div class="text-xs text-gray-400 font-mono">${item.weight} ${t('kg_per_sa', state.lang)}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <input type="number" step="0.01" min="0" placeholder="0.00"
                  class="price-input w-40 border border-gray-300 rounded-lg p-3 text-right font-mono text-xl focus:border-accent-500 focus:ring-1 focus:ring-accent-500 focus:outline-none transition bg-gray-50 focus:bg-white"
                  data-id="${item.id}"
                  value="${price}">
              </div>
            </div>
          `;
  }).join('')}
      </div>

      <div class="mt-8 flex justify-between items-center border-t border-gray-200 pt-6">
        <button onclick="window.app.setStep('wizard-1')" class="text-gray-500 hover:text-primary-700 font-medium px-6 py-3 transition">
          ${arrowBack} ${t('back', state.lang)}
        </button>
        <button onclick="window.app.setStep('wizard-3')" 
          class="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition transform hover:scale-105">
          ${t('next', state.lang)} ${arrowNext}
        </button>
      </div>
    </div>
  `;
}

function WizardStep3(state, shouldAnimate = true) {
  const isRtl = state.lang === 'ar' || state.lang === 'ur';
  const arrowBack = isRtl ? '→' : '←';

  return `
    <div class="max-w-3xl mx-auto py-8 px-4 ${shouldAnimate ? 'animate-fade-in' : ''} relative z-10">
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4 text-primary-700 font-arabic">${t('configuration', state.lang)}</h2>
        <div class="flex gap-2 mb-6">
          <div class="h-2 w-1/3 bg-primary-200 rounded"></div>
          <div class="h-2 w-1/3 bg-primary-200 rounded"></div>
          <div class="h-2 w-1/3 bg-accent-500 rounded"></div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <!-- Beneficiaries -->
        <div class="bg-white p-6 rounded-xl shadow border-2 border-transparent hover:border-accent-200 transition duration-300 relative group">
          <div class="absolute inset-0 bg-primary-50 scale-0 group-hover:scale-100 transition duration-500 rounded-xl rounded-tr-3xl -z-10 origin-bottom-left"></div>
          <label class="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide font-arabic">
            👥 ${t('beneficiaries', state.lang)}
          </label>
          <div class="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-accent-500 focus-within:ring-2 focus-within:ring-accent-500/20 transition bg-white">
             <input type="number" min="1" step="1"
              class="setting-input w-full p-4 text-2xl font-bold text-center outline-none bg-transparent"
              data-key="beneficiaries"
              value="${state.settings.beneficiaries}">
          </div>
          <p class="text-xs text-gray-400 mt-2 text-center font-arabic">${t('num_people_needed', state.lang)}</p>
        </div>

        <!-- Target Price -->
        <div class="bg-white p-6 rounded-xl shadow border-2 border-transparent hover:border-accent-200 transition duration-300 relative group">
           <div class="absolute inset-0 bg-primary-50 scale-0 group-hover:scale-100 transition duration-500 rounded-xl rounded-tl-3xl -z-10 origin-bottom-right"></div>
           <label class="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide font-arabic">
            💰 ${t('target_package_price', state.lang)}
          </label>
           <div class="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-accent-500 focus-within:ring-2 focus-within:ring-accent-500/20 transition bg-white">
             <input type="number" min="1" step="0.5"
              class="setting-input w-full p-4 text-2xl font-bold text-center outline-none bg-transparent"
              data-key="targetPrice"
              value="${state.settings.targetPrice}">
          </div>
           <p class="text-xs text-gray-400 mt-2 text-center font-arabic">${t('cost_per_parcel', state.lang)}</p>
        </div>
      </div>

      <div class="mt-8 flex justify-between items-center border-t border-gray-200 pt-6">
        <button onclick="window.app.setStep('wizard-2')" class="text-gray-500 hover:text-primary-700 font-medium px-6 py-3 transition">
          ${arrowBack} ${t('back', state.lang)}
        </button>
        <button onclick="window.app.setStep('results')" 
          class="bg-accent-500 hover:bg-accent-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 flex items-center gap-2">
          <span>✔️</span> ${t('finish', state.lang)}
        </button>
      </div>
    </div>
  `;
}

function Results(state, shouldAnimate = true) {
  const results = calculateResults(state);

  if (!results) {
    return `
      <div class="text-center py-20">
        <h2 class="text-2xl text-red-500">Error: No logic data</h2>
        <button onclick="window.app.setStep('wizard-1')" class="mt-4 underline">Restart</button>
      </div>
    `;
  }

  const { avgCostPerPerson, totalRequiredAmount, totalParcels, shoppingList } = results;

  return `
    <div class="max-w-5xl mx-auto py-8 px-4 ${shouldAnimate ? 'animate-fade-in' : ''} relative z-10" id="print-area">
      <div class="flex justify-between items-center mb-8 no-print">
        <h2 class="text-3xl font-bold text-primary-700 font-arabic">${t('results', state.lang)}</h2>
        <div class="flex gap-2">
           <button onclick="window.print()" class="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition text-sm shadow">
            🖨️ ${t('print_report', state.lang)}
          </button>
          <button onclick="window.app.exportExcel()" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm flex items-center gap-1 shadow">
            📊 ${t('export_excel', state.lang)}
          </button>
           <button onclick="window.app.exportJSON()" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition text-sm flex items-center gap-1 shadow">
            {} JSON
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-gradient-to-br from-primary-600 to-primary-800 text-white p-6 rounded-xl shadow-xl transform hover:scale-105 transition border-t-4 border-accent-500 relative overflow-hidden">
          <div class="absolute right-0 top-0 opacity-10 text-9xl -mr-4 -mt-4 text-white">💰</div>
          <div class="text-primary-100 text-sm uppercase font-bold mb-1 opacity-80">${t('total_cost', state.lang)}</div>
          <div class="text-4xl font-bold mb-2">${totalRequiredAmount.toFixed(2)}</div>
          <div class="text-primary-200 text-sm italic">${t('for', state.lang)} ${state.settings.beneficiaries} ${t('beneficiaries', state.lang)}</div>
        </div>
        
        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition relative overflow-hidden">
           <div class="absolute right-0 top-0 opacity-5 text-8xl -mr-4 -mt-4 text-primary-900">📦</div>
           <div class="text-gray-500 text-sm uppercase font-bold mb-1 font-arabic">${t('total_parcels', state.lang)}</div>
           <div class="text-4xl font-bold text-gray-800 mb-2">${Math.floor(totalParcels)} <span class="text-lg text-gray-400 font-light">(${totalParcels.toFixed(2)})</span></div>
           <div class="text-gray-400 text-sm">${state.settings.targetPrice} / Parcel</div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition relative overflow-hidden">
           <div class="absolute right-0 top-0 opacity-5 text-8xl -mr-4 -mt-4 text-accent-500">⚖️</div>
           <div class="text-gray-500 text-sm uppercase font-bold mb-1 font-arabic">${t('cost_per_person', state.lang)}</div>
           <div class="text-4xl font-bold text-accent-600 mb-2">${avgCostPerPerson.toFixed(2)}</div>
           <div class="text-gray-400 text-sm font-arabic">${t('avg_cost_sa', state.lang)}</div>
        </div>
      </div>

      <!-- Shopping List -->
      <div class="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden mb-8">
        <div class="bg-primary-50 px-6 py-4 border-b border-primary-100 flex items-center gap-2">
          <span class="text-xl">🛒</span>
          <h3 class="font-bold text-primary-700 font-arabic">
             ${t('qty_needed', state.lang)}
          </h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-arabic">
              <tr>
                <th class="px-6 py-3 font-medium">${t('item_name', state.lang)}</th>
                <th class="px-6 py-3 font-medium text-right">${t('price_per_kg', state.lang)}</th>
                <th class="px-6 py-3 font-medium text-right">${t('total_weight', state.lang)}</th>
                 <th class="px-6 py-3 font-medium text-right">${t('cost_share', state.lang)}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              ${shoppingList.map(item => {
    const price = state.prices[item.id] || 0;
    const estimatedCost = item.totalWeight * price;
    return `
                  <tr class="hover:bg-primary-50/30 transition duration-150">
                    <td class="px-6 py-4 font-bold text-gray-800 font-arabic">${t(item.id, state.lang)}</td>
                    <td class="px-6 py-4 text-right text-gray-600 font-mono">${price}</td>
                    <td class="px-6 py-4 text-right font-bold text-primary-700 bg-primary-50">
                      ${item.totalWeight.toFixed(2)} kg
                    </td>
                    <td class="px-6 py-4 text-right text-gray-600 font-mono">
                      ${estimatedCost.toFixed(2)}
                    </td>
                  </tr>
                `;
  }).join('')}
            </tbody>
          </table>
        </div>
      </div>

       <div class="text-center no-print mt-10">
         <button onclick="window.app.setStep('wizard-1')" class="text-gray-500 hover:text-accent-600 underline transition duration-300 font-arabic">
           ${t('back', state.lang)} / Start Over
         </button>
       </div>
    </div>
  `;
}

// --- Main App Logic ---

class App {
  constructor() {
    this.currentStep = 'welcome';
    this.lastRenderedStep = null;
    this.appEl = document.getElementById('app');

    // Initial Render
    this.render(store.state);

    // Subscribe to store updates for NAV/Global changes only (optional in vanilla flow if we control inputs locally)
    store.subscribe((state) => {
      // Only re-render if we are NOT editing inputs to avoid focus loss
      // But 'subscribe' sends all updates.
      // We handle input updates silently in the event listener now.
      // So if subscribe fires, it means something unrelated to my typing changed, OR I forgot to suppress.
      // Ideally, we re-render. 
      // If we suppress notify on inputs, this won't fire on typing.
      this.render(state);
    });

    window.app = this;

    this.setupGlobalListeners();
  }

  setStep(step) {
    this.currentStep = step;
    store.notify(); // Ensure logic updates if needed or just re-render
    // Actually store.notify triggers render via subscribe.
    window.scrollTo(0, 0);
  }

  toggleItem(id) {
    store.toggleItem(id);
  }

  exportExcel() {
    const state = store.state;
    const results = calculateResults(state);
    if (!results) return;

    const { shoppingList, totalRequiredAmount, totalParcels } = results;

    const data = shoppingList.map(item => ({
      Item: t(item.id, state.lang),
      'Price/Kg': state.prices[item.id],
      'Total Weight (kg)': item.totalWeight.toFixed(2),
      'Estimated Cost': (item.totalWeight * state.prices[item.id]).toFixed(2)
    }));

    data.push({});
    data.push({ Item: 'TOTAL REQUIRED AMOUNT', 'Estimated Cost': totalRequiredAmount.toFixed(2) });
    data.push({ Item: 'TOTAL PARCELS', 'Estimated Cost': Math.floor(totalParcels) });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Procurement List");
    XLSX.writeFile(wb, "Zakat_Procurement.xlsx");
  }

  exportJSON() {
    const state = store.state;
    const results = calculateResults(state);
    if (!results) return;

    const data = {
      generatedAt: new Date().toISOString(),
      settings: state.settings,
      items: state.prices,
      results
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zakat_data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  setupGlobalListeners() {
    // Language
    this.appEl.addEventListener('change', (e) => {
      if (e.target.id === 'lang-select') {
        store.setLang(e.target.value);
        this.updateLanguageFlag(e.target.value);
      }
    });

    // Checkboxes (Use standard update, triggers render - acceptable for checkboxes)
    this.appEl.addEventListener('change', (e) => {
      if (e.target.classList.contains('item-checkbox')) {
        this.toggleItem(e.target.value);
      }
    });

    // Price Inputs - USE SILENT UPDATE
    this.appEl.addEventListener('input', (e) => {
      if (e.target.classList.contains('price-input')) {
        const id = e.target.getAttribute('data-id');
        // Pass true to suppress notification/render
        store.setPrice(id, e.target.value, true);
      }
    });

    // Settings Inputs - USE SILENT UPDATE
    this.appEl.addEventListener('input', (e) => {
      if (e.target.classList.contains('setting-input')) {
        const key = e.target.getAttribute('data-key');
        const val = parseFloat(e.target.value);
        // Pass true to suppress notification/render
        store.setSettings({ [key]: val }, true);
      }
    });
  }

  updateLanguageFlag(lang) {
    const flagCodes = {
      ar: 'sa',
      en: 'gb',
      ur: 'pk',
      tr: 'tr',
      hi: 'in',
      id: 'id',
      ms: 'my'
    };

    const select = document.getElementById('lang-select');
    if (select && flagCodes[lang]) {
      const flagUrl = `https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3/${flagCodes[lang]}.svg`;
      select.style.backgroundImage = `url('${flagUrl}')`;
    }
  }

  render(state) {
    const shouldAnimate = this.currentStep !== this.lastRenderedStep;
    this.lastRenderedStep = this.currentStep;

    let content = '';
    switch (this.currentStep) {
      case 'welcome': content = WelcomeScreen(state, shouldAnimate); break;
      case 'wizard-1': content = WizardStep1(state, shouldAnimate); break;
      case 'wizard-2': content = WizardStep2(state, shouldAnimate); break;
      case 'wizard-3': content = WizardStep3(state, shouldAnimate); break;
      case 'results': content = Results(state, shouldAnimate); break;
      default: content = WelcomeScreen(state, shouldAnimate);
    }

    this.appEl.innerHTML = `
      <div class="min-h-screen flex flex-col font-sans print:bg-white bg-islamic-pattern">
        <div class="no-print">
          ${Header(state)}
        </div>
        <main class="flex-grow">
          ${content}
        </main>
        <footer class="bg-primary-900 py-6 text-center text-primary-200 text-sm no-print mt-auto border-t-4 border-accent-600">
          <p class="font-arabic">Zakat Al-Fitr Planner &copy; 2026 • Built for Good</p>
        </footer>
      </div>
    `;

    // RTL/LTR
    const dir = (state.lang === 'ar' || state.lang === 'ur') ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = state.lang;

    // Update flag icon
    setTimeout(() => this.updateLanguageFlag(state.lang), 0);
  }
}

new App();
