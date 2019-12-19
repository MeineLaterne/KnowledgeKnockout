import { MySQL } from '../mysql/MySql';

export class Questions {
    public static async test(qID: number, answerID: number): Promise<boolean> {
        try {
            const result = await MySQL.query('SELECT isCorrect FROM answer WHERE id=? && questionId=?', [answerID, qID]);
            return !!result.isCorrect;
        }
        catch(error) {
            return false;
        }
    }
}