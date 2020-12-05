function growth_rate(current_value, last_value) {
    if (isNaN(current_value) || isNaN(last_value) || last_value === 0) return 0;

    const growth_rate = ((current_value - last_value) / last_value);

    return Number.parseFloat(growth_rate.toFixed(2));
}

exports.growth_rate = growth_rate;