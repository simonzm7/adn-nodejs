import { OperationsValidations } from "src/domain/UserActions/Users/Validations/OperationsValidations"



describe('User Operations Validations Test', () => {
    it('it should be fail if the user want to reload more of nine millions', () => {
        try {
            const _userOperations: OperationsValidations = new OperationsValidations();
            _userOperations.userHaveBalance(10000000, 1000000);
        } catch (e) {
            expect(e.response.message.code).toBe('invalid_balance');
        }

    });
})