#import <Foundation/Foundation.h>

@class MarkdownASTNode;
@class RenderContext;

@interface AttributedRenderer : NSObject
- (instancetype)initWithConfig:(id)config;
- (NSMutableAttributedString *)renderRoot:(MarkdownASTNode *)root context:(RenderContext *)context;
// Renders a blockquote's own content (the nodes left after nested quotes/code blocks are split
// out) with a blockquote baseline block style instead of paragraph: text picks up the quote's
// font/color and paragraphs render tight (no paragraph margins), matching the commonmark path.
// It draws no box; the ENRMBlockquoteContainerView draws the border/background/padding.
- (NSMutableAttributedString *)renderRoot:(MarkdownASTNode *)root
                                  context:(RenderContext *)context
                      asBlockquoteContent:(BOOL)asBlockquoteContent;
- (CGFloat)getLastElementMarginBottom;
- (void)setAllowTrailingMargin:(BOOL)allow;
@end
