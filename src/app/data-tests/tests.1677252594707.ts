export const dataTests = {"userMail":"damien.tornambe@etu.univ-grenoble-alpes.fr","version":33,"mutants":[],"suites":[{"LtestIds":["EiOSt6M9fqJGOdw3UOpB","DKcMu2o3HMfH1VnPDqpK","vmdlqqzepUgLckzMkSeR","G5GQk3BqPYbluZpoiA9g","L9mltrabCKz11tK76Q4N","gGnHBHAKjb1lTYs6CDpf","pPOGmthVm9XqRwbhRAcn","KtaNd2emxuM60D4SvPjv","bNRg5pfdH1RT5sjy1z7m","NTcnzYowl6nx4pHAjKhB","cEY9XDbCeLaBpFdyjgpk","9CRGvFVdp7CctOGmIDlC","ZAhA2PYTBIOZc9ocPLy7","bHJ2E9U8VBsL0MEbLdit","1AhsaBqE7PONlEEhIsQV"],"label":"Tests isValid état intial de jeu","id":"SDYFAYRoIX5HN2wVwfI1","tests":[{"op":"isValid","comment":"Si le nombre de tokens de la colonne 1 > 6","id":"EiOSt6M9fqJGOdw3UOpB","params":[{"grid":[["P1","P2","P1","P2","P1","P2","P1"],[],[],[],[],[],[]],"turn":"P1"}],"expect":{"valid":false,"reason":"column 1 has too much tokens"}},{"op":"isValid","comment":"Si le nombre de tokens de la colonne 2 > 6","params":[{"grid":[[],["P1","P2","P1","P2","P1","P2","P1"],[],[],[],[],[]],"turn":"P1"}],"expect":{"valid":false,"reason":"column 2 has too much tokens"},"id":"DKcMu2o3HMfH1VnPDqpK"},{"id":"vmdlqqzepUgLckzMkSeR","op":"isValid","comment":"Si le nombre de tokens de la colonne 3 > 6","params":[{"grid":[[],[],["P1","P2","P1","P2","P1","P2","P1"],[],[],[],[]],"turn":"P1"}],"expect":{"valid":false,"reason":"column 3 has too much tokens"}},{"params":[{"grid":[[],[],[],["P1","P2","P1","P2","P1","P2","P1"],[],[],[]],"turn":"P1"}],"expect":{"valid":false,"reason":"column 4 has too much tokens"},"id":"G5GQk3BqPYbluZpoiA9g","op":"isValid","comment":"Si le nombre de tokens de la colonne 4 > 6"},{"expect":{"valid":false,"reason":"column 5 has too much tokens"},"op":"isValid","id":"L9mltrabCKz11tK76Q4N","comment":"Si le nombre de tokens de la colonne 5 > 6","params":[{"grid":[[],[],[],[],["P1","P2","P1","P2","P1","P2","P1"],[],[]],"turn":"P1"}]},{"op":"isValid","params":[{"grid":[[],[],[],[],[],["P1","P2","P1","P2","P1","P2","P1"],[]],"turn":"P1"}],"id":"gGnHBHAKjb1lTYs6CDpf","comment":"Si le nombre de tokens de la colonne 6 > 6","expect":{"reason":"column 6 has too much tokens","valid":false}},{"id":"pPOGmthVm9XqRwbhRAcn","comment":"Si le nombre de tokens de la colonne 7 > 6","expect":{"valid":false,"reason":"column 7 has too much tokens"},"params":[{"grid":[[],[],[],[],[],[],["P1","P2","P1","P2","P1","P2","P1"]],"turn":"P1"}],"op":"isValid"},{"expect":{"valid":false,"reason":"not the turn of P1"},"params":[{"grid":[["P1"],[],[],[],[],[],[]],"turn":"P1"}],"comment":"Le nombre de tokens du player 1 > tokens du player 2 && tour joueur 1","op":"isValid","id":"KtaNd2emxuM60D4SvPjv"},{"id":"bNRg5pfdH1RT5sjy1z7m","comment":"Le nombre de tokens du player 1 <= tokens du player 2 && tour joueur 2","expect":{"reason":"not the turn of P2","valid":false},"op":"isValid","pass":true,"params":[{"grid":[[],[],[],[],[],[],[]],"turn":"P2"}],"result":{"exec":"success","returns":{"reason":"not the turn of P1","valid":false}}},{"expect":{"valid":false,"reason":"too much token for P1"},"op":"isValid","id":"NTcnzYowl6nx4pHAjKhB","params":[{"grid":[["P1"],["P1"],[],[],[],[],[]],"turn":"P2"}],"comment":"Le nombre du token de P1 est > nb tokens player 2 + 1 "},{"id":"cEY9XDbCeLaBpFdyjgpk","expect":{"reason":"too much token for P2","valid":false},"params":[{"grid":[["P2"],[],[],[],[],["P2"],[]],"turn":"P1"}],"pass":true,"comment":"Le nombre du token de P2 est > nb tokens player 1 + 1 ","result":{"exec":"success","returns":{"reason":"too much token for P1","valid":false}},"op":"isValid"},{"id":"9CRGvFVdp7CctOGmIDlC","expect":{"valid":false,"reason":"There cannot be two winners"},"params":[{"grid":[["P1","P1","P1","P1"],["P2","P2","P2","P2"],[],[],[],[],[]],"turn":"P1"}],"op":"isValid","comment":"si les deux joueurs réunissent les conditions pour gagner en même temps = lignes"},{"expect":{"valid":false,"reason":"There cannot be two winners"},"pass":true,"params":[{"grid":[["P1","P1","P1","P1"],["P2","P2","P2"],["P1","P2"],["P1","P1","P2"],["P1","P1","P1","P2"],["P2"],["P2","P2"]],"turn":"P2"}],"result":{"exec":"success","returns":{"reason":"There cannot be two winners","valid":false}},"id":"ZAhA2PYTBIOZc9ocPLy7","comment":"si les deux joueurs réunissent les conditions pour gagner en même temps = diagonales","op":"isValid"},{"comment":"au joueur 1 de jouer ","expect":{"valid":true},"params":[{"grid":[[],[],[],[],[],[],[]],"turn":"P1"}],"id":"bHJ2E9U8VBsL0MEbLdit","op":"isValid"},{"id":"1AhsaBqE7PONlEEhIsQV","comment":"un qui gagne","params":[{"grid":[[],[],["P1","P2","P1","P2"],["P1","P2"],["P1","P2"],["P1"],[]],"turn":"P2"}],"op":"isValid","expect":{"valid":true}}]}],"canObserve":[],"evals":[-1,{"play":[0,0],"isValid":[0,0],"winner":[0,0]},{"isValid":[0,0],"play":[0,0],"winner":[0,0]}]}