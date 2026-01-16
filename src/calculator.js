import { items } from './data.js';

export function calculateResults(state) {
    const { selectedItems, prices, settings } = state;
    const { beneficiaries, targetPrice } = settings;

    if (selectedItems.length === 0) return null;

    let totalCostPerPerson = 0;
    const itemDetails = [];

    selectedItems.forEach(id => {
        const item = items.find(i => i.id === id);
        if (!item) return;
        const price = prices[id] || 0;
        const itemCost = price * item.weight;
        totalCostPerPerson += itemCost;
        itemDetails.push({
            ...item,
            price,
            itemCost
        });
    });

    const avgCostPerPerson = totalCostPerPerson / selectedItems.length;
    const totalRequiredAmount = avgCostPerPerson * beneficiaries;
    const totalParcels = targetPrice > 0 ? totalRequiredAmount / targetPrice : 0;
    const roundedParcels = Math.floor(totalParcels); // Usually parcels are whole numbers? Req says "11.87 Parcels", implies keeping decimal possible or floor?
    // "How many 'Value Parcels' can be created". Usually physically you create whole parcels. But prompt example has 11.87. I will keep raw calculate but maybe display floor for "Number of Parcels" card and show decimal as detail.

    // Shopping List logic:
    // "Calculate the total weight needed for each item based on the distribution logic."
    // Logic: Each selected item contributes 1/N of the total "Sa's".
    // Note: the "Mixed Food Parcel" method implies each person gets a mix?
    // User Prompt: "Average Cost per Person: Sum of (Cost of Sa' for all selected items) / Number of selected items."
    // This implies we are averaging the *cost*, effectively creating a "Virtual Sa'" composed of equal parts of selected items?
    // Or does it mean we distribute Item A to some, Item B to others?
    // Logic: "Cost of Sa' per Item: $P \times W$. Average Cost per Person...".
    // This average cost creates a fund. This fund is then used to buy parcels.
    // The parcels are "Value Parcels".
    // Shopping list should likely support the *Parcels* creation?
    // Wait, if 11.87 Parcels are created. Each parcel costs 20 JOD.
    // Content of the parcel? The prompt doesn't specify the *content* of the "Value Parcel", just its price.
    // BUT, it asks for "Shopping List: Calculate the total weight needed for each item based on the distribution logic."
    // If we paying Zakat for 50 people.
    // We collect TotalRequiredAmount.
    // We make Parcels each worth TargetPrice.
    // The shopping list might be for the *original* obligation items calculation?
    // Or is the "Value Parcel" filled with these items?
    // User says: "diverse food parcels rather than single-item bags".
    // This implies the 20 JOD parcel contains a mix of the selected items.
    // If so, the mix ratio should probably be equal by value or by Sa' fraction?
    // PROMPT CLARIFICATION needed? Or assume 1/N distribution.
    // "Average Cost per Person = Sum(Sa Cost) / N". This implies 1/N of a Sa' of each item per person?
    // Yes, (Sum Cost)/N = (Sum (P*W * 1))/N = Sum(P * (W/N)).
    // So each person effectively gets W/max_items of each item? No.
    // Example: Rice ($2.5 Sa) + Jameed ($7 Sa). Avg = $4.75.
    // This $4.75 covers ONE person's Zakat.
    // So for 1 person, we effectively "gave" them (0.5 Sa Rice + 0.5 Sa Jameed)?
    // Cost = 0.5 * 2.5(price of 2.5kg? No. Cost of Sa).
    // Cost of Sa Rice = 2.5kg * $1 = $2.5.
    // Cost of Sa Jameed = 1.0kg * $7 = $7.
    // Avg = 4.75.
    // If we split 1 person's obligation equally: 0.5 of Rice Obligation + 0.5 of Jameed Obligation?
    // 0.5 * $2.5 + 0.5 * $7 = 1.25 + 3.5 = 4.75. Correct.
    // So the physical distribution per person is:
    // 0.5 Sa Rice + 0.5 Sa Jameed.
    // Weight of Rice needed per person = 0.5 * 2.5kg = 1.25kg.
    // Weight of Jameed needed per person = 0.5 * 1.0kg = 0.5kg.
    // This seems to be the logical implication for the shopping list for the Beneficiaries.
    // Total Weight Item X = (Beneficiaries / NumSelectedItems) * WeightPerSa_X.
    //
    // BUT, calculation for "Total Parcels":
    // Total Required Amount = 50 * 4.75 = 237.5.
    // Package Price = 20.
    // # Parcels = 11.87.
    // Does the shopping list reflect the *Parcels* or the *Beneficiaries*?
    // "Shopping List: Calculate the total weight needed for each item based on the distribution logic."
    // Usually you buy food to cover the beneficiaries. The packing into "Value Parcels" is a distribution mechanism.
    // So I should calculate total food needed to cover the 50 beneficiaries.
    // Total Item Weight = (Beneficiaries / NumSelectedItems) * ItemSaHeight.

    const numSelected = selectedItems.length;
    const shoppingList = selectedItems.map(id => {
        const item = items.find(i => i.id === id);
        const totalWeight = (beneficiaries / numSelected) * item.weight;
        return { ...item, totalWeight };
    });

    return {
        itemDetails,
        avgCostPerPerson,
        totalRequiredAmount,
        totalParcels,
        shoppingList
    };
}
