/**
 * Load topics
 */

var Topics = {};

/**
 * get topics as JSON and return the topics grouped by category
 *
 * [
 *   {
 *     title: <category>,
 *     topics: [
 *       <topic data from gbtopics>
 *     ]
 *   }
 * ]
 */
Topics.loadTopics = function(url, callback) {
  $.getJSON(url, function(data) {
    // sort by categorysort and categorytitle
    var gbtopics = data.gbtopics.sort(function(a, b) {
      var res = a.categorysort - b.categorysort;
      if (res === 0) {
        res = a.categorytitle.localeCompare(b.categorytitle);
      }
      else if (a.categorysort === null || b.categorysort === null) {
        // null values have lowest priority
        res = -res;
      }
      return res;
    });

    // group by category
    categories = {};
    for (var i=0;i<gbtopics.length; i++) {
      var topic = gbtopics[i];

      if (categories[topic.categorytitle] === undefined) {
        categories[topic.categorytitle] = [];
      }
      categories[topic.categorytitle].push(topic);
    }

    var sortedCategories = [];
    for (var key in categories) {
      if (categories.hasOwnProperty(key)) {
        // sort by categories_topics_sort and title
        var topics = categories[key].sort(function(a, b) {
          var res = a.categories_topics_sort - b.categories_topics_sort;
          if (res === 0) {
            res = a.title.localeCompare(b.title);
          }
          else if (a.categories_topics_sort === null || b.categories_topics_sort === null) {
            // null values have lowest priority
            res = -res;
          }
          return res;
        });
        sortedCategories.push({
          title: key,
          topics: topics
        });
      }
    }

    callback(sortedCategories);
  });
};
