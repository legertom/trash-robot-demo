# Backup output for the trash robot demo

These results were captured from the three checkpoints in this repository. Use this page if the live coding agent takes longer than the demo window.

## Starting behavior on `main`

```text
✔ initial check: Tuesday indoor bins are empty
tests 1 · pass 1 · fail 0

Tuesday result:
  kitchenBags: 0
  bathroomBags: 0
  garageBags: 2
  cartBags: 0
  cartLocation: 'garage'
```

## Expanded acceptance tests on `demo-tests`

```text
✖ AC1: Tuesday moves both indoor bags into the cart at the curb
✖ AC2: Tuesday works when the cart starts at the curb
✖ AC3: Wednesday after collection returns the cart to the garage
✖ AC4: Wednesday delay keeps the cart at the curb for a human decision
✔ initial check: Tuesday indoor bins are empty
tests 5 · pass 1 · fail 4

AC1 and AC2: the garage is clear — actual 2, expected 0
AC3: the cart returns after collection — actual 'curb', expected 'garage'
AC4: a delayed pickup goes to the owner — actual false, expected true
```

## Completed implementation on `demo-done`

```text
✔ AC1: Tuesday moves both indoor bags into the cart at the curb
✔ AC2: Tuesday works when the cart starts at the curb
✔ AC3: Wednesday after collection returns the cart to the garage
✔ AC4: Wednesday delay keeps the cart at the curb for a human decision
✔ initial check: Tuesday indoor bins are empty
tests 5 · pass 5 · fail 0

Tuesday result:
  kitchenBags: 0
  bathroomBags: 0
  garageBags: 0
  cartBags: 2
  cartLocation: 'curb'
```

The accepted test file is identical on `demo-tests` and `demo-done`:

```bash
git diff --stat demo-tests demo-done -- tests/
```

That command prints no output.
