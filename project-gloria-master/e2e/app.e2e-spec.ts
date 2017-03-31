import { ProjectGloriaPage } from './app.po';

describe('project-gloria App', function() {
  let page: ProjectGloriaPage;

  beforeEach(() => {
    page = new ProjectGloriaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
