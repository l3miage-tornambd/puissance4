export const dataTests = {"userMail":"damien.tornambe@etu.univ-grenoble-alpes.fr","version":18,"mutants":[],"suites":[{"id":"SDYFAYRoIX5HN2wVwfI1","LtestIds":["EiOSt6M9fqJGOdw3UOpB","DKcMu2o3HMfH1VnPDqpK","vmdlqqzepUgLckzMkSeR","G5GQk3BqPYbluZpoiA9g","L9mltrabCKz11tK76Q4N"],"label":"Tests isValid état intial de jeu","tests":[{"id":"EiOSt6M9fqJGOdw3UOpB","expect":{"reason":"column 1 has too much tokens","valid":false},"op":"isValid","params":[{"grid":[["P1","P2","P1","P2","P1","P2","P1"],[],[],[],[],[],[]],"turn":"P1"}],"comment":"Si le nombre de tokens de la colonne 1 > 6"},{"op":"isValid","expect":{"valid":false,"reason":"column 2 has too much tokens"},"comment":"Si le nombre de tokens de la colonne 2 > 6","id":"DKcMu2o3HMfH1VnPDqpK","params":[{"grid":[[],["P1","P2","P1","P2","P1","P2","P1"],[],[],[],[],[]],"turn":"P1"}]},{"expect":{"valid":false,"reason":"column 3 has too much tokens"},"op":"isValid","id":"vmdlqqzepUgLckzMkSeR","params":[{"grid":[[],[],["P1","P2","P1","P2","P1","P2","P1"],[],[],[],[]],"turn":"P1"}],"comment":"Si le nombre de tokens de la colonne 3 > 6"},{"params":[{"grid":[[],[],[],["P1","P2","P1","P2","P1","P2","P1"],[],[],[]],"turn":"P1"}],"id":"G5GQk3BqPYbluZpoiA9g","op":"isValid","comment":"Si le nombre de tokens de la colonne 4 > 6","expect":{"valid":false,"reason":"column 4 has too much tokens"}},{"op":"isValid","comment":"Si le nombre de tokens de la colonne 5 > 6","params":[{"grid":[[],[],[],[],["P1","P2","P1","P2","P1","P2","P1"],[],[]],"turn":"P1"}],"id":"L9mltrabCKz11tK76Q4N","expect":{"reason":"column 5 has too much tokens","valid":false}}]}],"canObserve":[],"evals":[-1,{"play":[0,0],"winner":[0,0],"isValid":[0,0]},{"winner":[0,0],"play":[0,0],"isValid":[0,0]}]}