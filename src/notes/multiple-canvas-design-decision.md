
Multiple canvas design decision
===============================

When an individual shape is changed, it might be efficient if we only have to redraw the changed shape and not rest of the scene. This would be significant when there are lot of shapes in the scene. To achieve this we can draw each shape on its separate canvas and then merge canvases of all shapes onto the main backend canvas.

When drawing each shape on separate canvas we have two choices about size of each canvas - either it's same as full size of the main backend canvas OR it's trimmed so that it's just big enough for the AABB of the shape.

From the experiments performed it's been found that creating multiple full canvases doesn't scale as the number of shapes increases. At about 1000 shapes the page crashes when using full canvas. On the other hand with trimmed canvas approach, the page will render event after 40000 shapes, although it will take time. Unfortunately, the JS Heap size comparision for the two cases is not as conclusive. When the page crashes JS Heap size can't be observed using timeline tool. So it can be observed only for lower number of shapes when both full canvas and trimmed canvas test cases work. At that number however the difference in JS Heap size is not significant and even smaller for full canvas case.

If we go with the trimmed canvas architecture however, then its implementation can be done in two ways. Calculate shape AABB before OR after applying the transform. If the AABB is calculated before applying transform, then the subsequent transform has to be adjusted so that the implementation detail of padded canvas per shape doesn't affect the final result. These adjustments are found to be complicated. If the AABB is calculated after applying transform, then there's a problem with reliable calculation of AABB. The analytical approach to calculate AABB of shape is quicker, i.e. calculating AABB based on the knowledge of its geometry e.g. rectangle, ellipse, bezier curve. However this approach becomes complicated for shapes after applying transforms. A possible simplication is to apply transform on AABB of original shape and not on the shape itself.

