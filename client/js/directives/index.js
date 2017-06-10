import { directive } from 'ng-annotations';
@directive('uDomoDirectives')
export default class {
  changeImage() {
    this.result = (scope, element, attrs) =>
        element.css(
          {
            'background-image': `url(${ attrs.Image })`,
            'background-size': 'cover',
          }
        );
    return this.result;
  }
  targetBlank() {
    this.compile = (element) => {
      const elems = element.prop('tagName') === 'A' ? element : element.find('a');
      elems.attr('target', '_blank');
    };
    return { compile: this.compile };
  }
  // showErrors() {
    // this.result = () => Object.assign(
    //   {
    //     restrict: 'A',
    //     require: '^form',
    //     link: (scope, el, attrs, formCtrl) => {
    //       const inputNgEl = angular.element(el[0].querySelector('[name]'));
    //       inputNgEl.bind('blur', () => {
    //         el.toggleClass('has-error', formCtrl[inputNgEl.attr('name')].$invalid);
    //       });
    //     },
    //   });
    // return this.result;
  // }
}
