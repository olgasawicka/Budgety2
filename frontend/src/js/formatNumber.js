export const formatNumber = (num, type) => {

    /* Rules:
    '+' or '-' before number
    exactly 2 decimal points
    the thousends comma separeted

    e.g.
    3490.789 => 3,490.79
    3500 => 3,500.00
    */

    let numSplit, int, dec;

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');
    int = numSplit[0];
    dec = numSplit[1];

    if(int.length > 3) {
        int = `${int.substring(0, int.length - 3)},${int.substring(int.length - 3, int.length)}`;
    }
    

    return (type === 'expense' ? '-' : '+') + ' ' + int + '.' + dec;
};