import * as QueryResolver from '../../src/https/query-resolver';
import { expect } from 'chai';
import 'mocha';

describe('Query resolver', () => {
    context('with zero parameters', () => {
        it('should not change the path', function () {
            expect(
                QueryResolver.addQueryParameters('/path', {})
            ).to.equal('/path');
        });
    });

    context('with parameters', () => {
        it('should return a valid query string', function () {
            expect(
                QueryResolver.addQueryParameters('/path', {
                    one: "First",
                    second: 42
                })
            ).to.equal('/path?one=First&second=42');
        });

        it('should escape special characters', function () {
            expect(
                QueryResolver.addQueryParameters('/path', {
                    problematic: "?"
                })
            ).to.contain('%3F')
                .and.to.not.contain('problematic=?');
        });
    });
});
