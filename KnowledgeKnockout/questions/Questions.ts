import { MySQL } from '../mysql/MySql';

export class Questions {
    public static async test(answerID: number, questionID: number): Promise<boolean> {
        try {
            const result = await MySQL.query('SELECT isCorrect FROM answer WHERE id=? AND questionId=?', [answerID, questionID]);
            console.log(result);
            return !!result.isCorrect;
        }
        catch(error) {
            return false;
        }
    }
}