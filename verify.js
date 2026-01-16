import { calculateResults } from './src/calculator.js';
import { items } from './src/data.js';

// User Example:
// Rice ($1/kg) and Jameed ($7/kg)
// 50 people
// Parcel Price = $20

const mockState = {
    selectedItems: ['rice', 'jameed'],
    prices: {
        rice: 1.0,
        jameed: 7.0
    },
    settings: {
        beneficiaries: 50,
        targetPrice: 20
    }
};

const results = calculateResults(mockState);

console.log("--- Logic Verification ---");
console.log(`Avg Cost per Person: ${results.avgCostPerPerson} (Expected: 4.75)`);
console.log(`Total Required: ${results.totalRequiredAmount} (Expected: 237.5)`);
console.log(`Total Parcels: ${results.totalParcels} (Expected: 11.875)`);
console.log(`Shopping List:`);
results.shoppingList.forEach(item => {
    console.log(`  ${item.id}: ${item.totalWeight}kg`);
});

if (
    results.avgCostPerPerson === 4.75 &&
    results.totalRequiredAmount === 237.5 &&
    Math.abs(results.totalParcels - 11.875) < 0.001
) {
    console.log("✅ VERIFICATION PASSED");
} else {
    console.error("❌ VERIFICATION FAILED");
    process.exit(1);
}
