export const dataTests = {"userMail":"damien.tornambe@etu.univ-grenoble-alpes.fr","version":25,"mutants":[],"suites":[{"label":"Tests isValid état intial de jeu","LtestIds":["EiOSt6M9fqJGOdw3UOpB","DKcMu2o3HMfH1VnPDqpK","vmdlqqzepUgLckzMkSeR","G5GQk3BqPYbluZpoiA9g","L9mltrabCKz11tK76Q4N","gGnHBHAKjb1lTYs6CDpf","pPOGmthVm9XqRwbhRAcn","KtaNd2emxuM60D4SvPjv","bNRg5pfdH1RT5sjy1z7m","NTcnzYowl6nx4pHAjKhB","cEY9XDbCeLaBpFdyjgpk"],"id":"SDYFAYRoIX5HN2wVwfI1","tests":[{"id":"EiOSt6M9fqJGOdw3UOpB","expect":{"reason":"column 1 has too much tokens","valid":false},"op":"isValid","params":[{"grid":[["P1","P2","P1","P2","P1","P2","P1"],[],[],[],[],[],[]],"turn":"P1"}],"comment":"Si le nombre de tokens de la colonne 1 > 6"},{"op":"isValid","expect":{"valid":false,"reason":"column 2 has too much tokens"},"comment":"Si le nombre de tokens de la colonne 2 > 6","id":"DKcMu2o3HMfH1VnPDqpK","params":[{"grid":[[],["P1","P2","P1","P2","P1","P2","P1"],[],[],[],[],[]],"turn":"P1"}]},{"expect":{"valid":false,"reason":"column 3 has too much tokens"},"op":"isValid","id":"vmdlqqzepUgLckzMkSeR","params":[{"grid":[[],[],["P1","P2","P1","P2","P1","P2","P1"],[],[],[],[]],"turn":"P1"}],"comment":"Si le nombre de tokens de la colonne 3 > 6"},{"params":[{"grid":[[],[],[],["P1","P2","P1","P2","P1","P2","P1"],[],[],[]],"turn":"P1"}],"id":"G5GQk3BqPYbluZpoiA9g","op":"isValid","comment":"Si le nombre de tokens de la colonne 4 > 6","expect":{"valid":false,"reason":"column 4 has too much tokens"}},{"op":"isValid","comment":"Si le nombre de tokens de la colonne 5 > 6","params":[{"grid":[[],[],[],[],["P1","P2","P1","P2","P1","P2","P1"],[],[]],"turn":"P1"}],"id":"L9mltrabCKz11tK76Q4N","expect":{"reason":"column 5 has too much tokens","valid":false}},{"op":"isValid","id":"gGnHBHAKjb1lTYs6CDpf","expect":{"valid":false,"reason":"column 6 has too much tokens"},"params":[{"grid":[[],[],[],[],[],["P1","P2","P1","P2","P1","P2","P1"],[]],"turn":"P1"}],"comment":"Si le nombre de tokens de la colonne 6 > 6"},{"op":"isValid","id":"pPOGmthVm9XqRwbhRAcn","params":[{"grid":[[],[],[],[],[],[],["P1","P2","P1","P2","P1","P2","P1"]],"turn":"P1"}],"comment":"Si le nombre de tokens de la colonne 7 > 6","expect":{"reason":"column 7 has too much tokens","valid":false}},{"id":"KtaNd2emxuM60D4SvPjv","op":"isValid","expect":{"valid":false,"reason":"not the turn of P1"},"comment":"Le nombre de tokens du player 1 > tokens du player 2 && tour joueur 1","params":[{"grid":[["P1"],[],[],[],[],[],[]],"turn":"P1"}]},{"result":{"exec":"success","returns":{"reason":"not the turn of P1","valid":false}},"pass":true,"id":"bNRg5pfdH1RT5sjy1z7m","op":"isValid","params":[{"grid":[[],[],[],[],[],[],[]],"turn":"P2"}],"expect":{"reason":"not the turn of P2","valid":false},"comment":"Le nombre de tokens du player 1 <= tokens du player 2 && tour joueur 2"},{"id":"NTcnzYowl6nx4pHAjKhB","op":"isValid","comment":"Le nombre du token de P1 est > nb tokens player 2 + 1 ","params":[{"grid":[["P1"],["P1"],[],[],[],[],[]],"turn":"P2"}],"expect":{"reason":"too much token for P1","valid":false}},{"op":"isValid","params":[{"grid":[["P1"],["P1"],[],[],[],[],[]],"turn":"P2"}],"expect":{"valid":false,"reason":"too much token for P1"},"id":"cEY9XDbCeLaBpFdyjgpk","pass":true,"comment":"Le nombre du token de P1 est > nb tokens player 2 + 1 ","result":{"exec":"success","returns":{"reason":"too much token for P1","valid":false}}}]}],"canObserve":[],"evals":[-1,{"winner":[0,0],"play":[0,0],"isValid":[0,0]},{"isValid":[0,0],"play":[0,0],"winner":[0,0]}]}