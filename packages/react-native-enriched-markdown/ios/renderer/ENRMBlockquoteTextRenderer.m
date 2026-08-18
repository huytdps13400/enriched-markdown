#import "ENRMBlockquoteTextRenderer.h"
#import "ParagraphStyleUtils.h"
#import "RenderContext.h"
#import "StyleConfig.h"

@implementation ENRMBlockquoteTextRenderer {
  StyleConfig *_config;
}

- (instancetype)initWithConfig:(StyleConfig *)config
{
  self = [super init];
  if (self) {
    _config = config;
  }
  return self;
}

- (void)pushOnContext:(RenderContext *)context
{
  context.blockquoteDepth = context.blockquoteDepth + 1;
  [context setBlockStyle:BlockTypeBlockquote font:_config.blockquoteFont color:_config.blockquoteColor headingLevel:0];
}

- (void)postProcess:(NSMutableAttributedString *)text
{
  // Paragraphs apply their own line height regardless of block type; a quote's own line height is
  // stamped over the whole run here, matching Android's BlockquoteTextRenderer.
  if (text.length > 0) {
    applyLineHeight(text, NSMakeRange(0, text.length), [_config blockquoteLineHeight]);
  }
}

@end
