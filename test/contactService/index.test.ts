import { expect } from 'chai';
import ContactService from '../../contactService';


describe(('contactService'), () => {
    it('passes the placeholder test', () => {
        expect(
            new ContactService('', '').search('')
        ).to.eql([])
    });
});
