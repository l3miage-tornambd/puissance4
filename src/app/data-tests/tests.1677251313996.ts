export const dataTests = {"userMail":"damien.tornambe@etu.univ-grenoble-alpes.fr","version":7,"mutants":[],"suites":[{"LtestIds":["MDFjUTbMC7XaPeUF0oLP","aVe04PueIPSZK71S2Mj8"],"id":"SDYFAYRoIX5HN2wVwfI1","label":"Tests isValid état intial de jeu","tests":[{"params":[{"grid":[["P1","P1"],[],[],[],[],[],[]],"turn":"P1"}],"op":"isValid","comment":"...","expect":{"reason":"too much token for P1","valid":false},"id":"MDFjUTbMC7XaPeUF0oLP"},{"op":"isValid","expect":{"valid":false,"reason":"not the turn of P2"},"comment":"...","id":"aVe04PueIPSZK71S2Mj8","params":[{"grid":[["P1"],["P2"],[],[],[],[],[]],"turn":"P2"}]}]}],"canObserve":[],"evals":[-1,{"isValid":[0,0],"winner":[0,0],"play":[0,0]},{"winner":[0,0],"isValid":[0,0],"play":[0,0]}]}