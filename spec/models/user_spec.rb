require 'spec_helper'

RSpec.describe 'User' do
  context 'for netids' do
    let(:valid_netid) { 'jsmith2' }
    let(:too_long_netid) { 'abcdefgh1234' }
    let(:special_char_netid) { 'abcd@illinois' }
    let(:num_before_name_netid) { 'jsmi2th' }
    let(:capital_netid) { 'Jsmith2' }

    it 'should accept a valid netid' do
      User.validate({ netid: valid_netid }, [:netid])[0].eql? 200
    end

    it 'should not accept a netid that is too long' do
      User.validate({ netid: too_long_netid }, [:netid])[0].eql? 400
    end

    it 'should not accept a netid that contains special characters' do
      User.validate({ netid: special_char_netid }, [:netid])[0].eql? 400
    end

    it 'should not accept a netid that has numbers in between the netid' do
      User.validate({ netid: num_before_name_netid }, [:netid])[0].eql? 400
    end

    it 'should not accept a netid that has a capital letter' do
      User.validate({ netid: capital_netid }, [:netid])[0].eql? 400
    end
  end
end
