# Backup output for the trash robot demo

These results were captured from the three stages of the exercise in `README.md`. Use this page if the live coding agent takes longer than the demo window.

## Starting point (`main`, README Steps 1 and 2)

```text
✔ initial check: Tuesday indoor bins are empty
ℹ tests 1
ℹ pass 1
ℹ fail 0
```

```text
Tuesday: one bag in the kitchen, one in the bathroom, cart in the garage (AC1)
  before: kitchenBags=1  bathroomBags=1  garageBags=0  cartBags=0  cartLocation=garage  pickupComplete=false  needsHuman=false
  after:  kitchenBags=0  bathroomBags=0  garageBags=2  cartBags=0  cartLocation=garage  pickupComplete=false  needsHuman=false

Wednesday: collection is complete, cart is at the curb (AC3)
  before: kitchenBags=0  bathroomBags=0  garageBags=0  cartBags=2  cartLocation=curb  pickupComplete=true  needsHuman=false
  after:  kitchenBags=0  bathroomBags=0  garageBags=0  cartBags=2  cartLocation=curb  pickupComplete=true  needsHuman=false

Wednesday: collection is delayed, cart is at the curb (AC4)
  before: kitchenBags=0  bathroomBags=0  garageBags=0  cartBags=2  cartLocation=curb  pickupComplete=false  needsHuman=false
  after:  kitchenBags=0  bathroomBags=0  garageBags=0  cartBags=2  cartLocation=curb  pickupComplete=false  needsHuman=false
```

## Accepted tests, original program (`demo-tests`, README Step 6)

```text
✖ AC1: Tuesday moves both indoor bags into the cart at the curb
✖ AC2: Tuesday works when the cart starts at the curb
✖ AC3: Wednesday after collection returns the cart to the garage
✖ AC4: Wednesday delay keeps the cart at the curb for a human decision
✔ initial check: Tuesday indoor bins are empty
ℹ tests 5
ℹ pass 1
ℹ fail 4

✖ failing tests:

✖ AC1: Tuesday moves both indoor bags into the cart at the curb
  AssertionError [ERR_ASSERTION]: the garage is clear
  2 !== 0

✖ AC2: Tuesday works when the cart starts at the curb
  AssertionError [ERR_ASSERTION]: the garage is clear
  2 !== 0

✖ AC3: Wednesday after collection returns the cart to the garage
  AssertionError [ERR_ASSERTION]: the cart returns after collection
  'curb' !== 'garage'

✖ AC4: Wednesday delay keeps the cart at the curb for a human decision
  AssertionError [ERR_ASSERTION]: a delayed pickup goes to the owner
  false !== true
```

## Completed program (`demo-done`, README Step 9)

```text
✔ AC1: Tuesday moves both indoor bags into the cart at the curb
✔ AC2: Tuesday works when the cart starts at the curb
✔ AC3: Wednesday after collection returns the cart to the garage
✔ AC4: Wednesday delay keeps the cart at the curb for a human decision
✔ initial check: Tuesday indoor bins are empty
ℹ tests 5
ℹ pass 5
ℹ fail 0
```

```text
Tuesday: one bag in the kitchen, one in the bathroom, cart in the garage (AC1)
  before: kitchenBags=1  bathroomBags=1  garageBags=0  cartBags=0  cartLocation=garage  pickupComplete=false  needsHuman=false
  after:  kitchenBags=0  bathroomBags=0  garageBags=0  cartBags=2  cartLocation=curb  pickupComplete=false  needsHuman=false

Wednesday: collection is complete, cart is at the curb (AC3)
  before: kitchenBags=0  bathroomBags=0  garageBags=0  cartBags=2  cartLocation=curb  pickupComplete=true  needsHuman=false
  after:  kitchenBags=0  bathroomBags=0  garageBags=0  cartBags=2  cartLocation=garage  pickupComplete=true  needsHuman=false

Wednesday: collection is delayed, cart is at the curb (AC4)
  before: kitchenBags=0  bathroomBags=0  garageBags=0  cartBags=2  cartLocation=curb  pickupComplete=false  needsHuman=false
  after:  kitchenBags=0  bathroomBags=0  garageBags=0  cartBags=2  cartLocation=curb  pickupComplete=false  needsHuman=true
```

The accepted test file is identical on `demo-tests` and `demo-done`:

```bash
git diff --stat demo-tests demo-done -- tests/
```

That command prints no output.
