export const getRotationDegrees = (
    prizeNumber: number,
    numberOfPrizes: number
) => {
    const degreesPerPrize = 360 / numberOfPrizes;

    const prizeRotation = degreesPerPrize * (numberOfPrizes - prizeNumber);

    return numberOfPrizes - prizeNumber > numberOfPrizes / 2
        ? -360 + prizeRotation
        : prizeRotation;
};

export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};
