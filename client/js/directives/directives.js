let Directives = angular.module('Directives', []);

Directives.directive('ChangeImage',
() => {
    return (scope, element, attrs) => {
        let url = attrs.Image;
        element.css(
        	{
            	"background-image": "url(" + url +")",
            	"background-size" : "cover"
        	}
        );
    };
})

.directive('targetBlank', 
() => {
  	return {
    	compile: (element) => {
				let elems = element.prop("tagName") === 'A' ? 
								element : 
								element.find('a');
      			elems.attr("target", "_blank");
		}
  	};
})

.directive('showErrors', 
() => {
    return {
      restrict: 'A',
      require:  '^form',
      link: (scope, el, attrs, formCtrl) => {
        // find the text box element, which has the 'name' attribute
        let inputEl   = el[0].querySelector("[name]");
        // convert the native text box element to an angular element
        let inputNgEl = angular.element(inputEl);
        // get the name on the text box so we know the property to check
        // on the form controller
        let inputName = inputNgEl.attr('name');

        // only apply the has-error class after the user leaves the text box
        inputNgEl.bind('blur', () => {
          el.toggleClass('has-error', formCtrl[inputName].$invalid);
        })
      }
    }
});