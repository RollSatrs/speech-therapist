    import { test2_3 } from "../const/tests/test2_3"
    import { test3_4 } from "../const/tests/test3_4"
    import { test4_5 } from "../const/tests/test4_5"
    import { test5_7 } from "../const/tests/test5_7"

    export function getTestByAge(ageNumber: number){
        if(ageNumber >= 2 && ageNumber <= 3) return test2_3
        if(ageNumber >= 3 && ageNumber <= 4) return test3_4
        if(ageNumber >= 4 && ageNumber <= 5) return test4_5
        if(ageNumber >= 5 && ageNumber <= 7) return test5_7
        return test2_3
    }