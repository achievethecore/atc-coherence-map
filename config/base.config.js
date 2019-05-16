export const Config = {
  modelingPage: {
    landing: 'M',
    moreAbout: 'more-about',
    tasks: 'tasks'
  },
  conceptual_categories: {
    count: 6,
    items: [
      {
        name: 'Number and Quantity',
        code: 'N',
        grade: 'HS',
        ordinal: "N",
        ordinalPrefix: 'N',
        ordering: 1
      },
      {
        name: 'Algebra',
        code: 'A',
        ordinal: "A",
        ordinalPrefix: 'A',
        grade: 'HS',
        ordering: 2
      },
      {
        name: 'Functions',
        code: 'F',
        ordinal: "F",
        ordinalPrefix: 'F',
        grade: 'HS',
        ordering: 3
      },
      {
        name: 'Modeling',
        code: 'M',
        ordinal: "M",
        ordinalPrefix: 'Modeling',
        grade: 'HS',
        noStandard: true,
        ordering: 4
      },
      {
        name: 'Geometry',
        code: 'G',
        ordinal: "G",
        ordinalPrefix: 'G',
        grade: 'HS',
        ordering: 5
      },
      {
        name: 'Statistics and Probability',
        code: 'S',
        ordinal: "S",
        ordinalPrefix: 'S',
        grade: 'HS',
        ordering: 6
    }
    ]
  },
  course_results_methodology: {
    all: {
      from: 90,
      text: 'All or almost all',
      highlight: true
    },
    most: {
      from: 65,
      to: 89,
      text: 'Most',
      highlight: true
    },
    some: {
      from: 20,
      to: 64,
      text: 'Some'
    },
    few: {
      to: 19,
      text: 'Few or None'
    }
  },
  
};