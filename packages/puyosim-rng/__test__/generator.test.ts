import generatePuyoPools from '../src/index';

describe('Generate Puyo Pools', () => {
  test("I hope this doesn't break", () => {
    let threeColor: number[];
    let fourColor: number[];
    let fiveColor: number[];

    const generate = jest.fn(() => {
      [threeColor, fourColor, fiveColor] = generatePuyoPools(65535);
    });

    generate();

    console.log('3 Color:', threeColor);
    console.log('4 Color:', fourColor);
    console.log('5 Color:', fiveColor);

    expect(generate).toHaveReturned();
  });
});
