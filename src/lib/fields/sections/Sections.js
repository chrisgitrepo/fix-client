const { SECTIONS } = require('../../spec/SpecSections')
const { SectionType } = require('./SectionType')

class Sections {
    constructor() {
        this.sections = SECTIONS;
        this.cacheMap = new Map();
        this.sections.forEach((section) => {
            this.cacheMap.set(section.SectionID, section);
        });
        this.sectionType = new SectionType();
    }

    processSection(item, sectionId) {
        this.sectionType.reset();
        const sectionData = this.cacheMap.get(String(sectionId));
        if (sectionData) {
            this.sectionType.setSection(sectionData);
            item.setSection(this.sectionType);
        }
    }
}

module.exports = { Sections }