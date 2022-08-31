import React from 'react';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
    MobiletitlePageSection
    , MobileSection
    , MobileTitlePage
    , MobileTextPage
    , MobileTitleImage
    , MobileTextArea
} from './StorylineStyleForViewer';

const StorylineDocumentForMobile = () => {
    const { createdStory, creatingStory } = useSelector(state => state.storyline);
    const { storyData } = useSelector(state => state.storyData);
    const [entireStory, setEntireStory] = useState([]);

    useEffect(() => {
        const storylineIntoChunk = [
            ...createdStory.map(v => (v.outputText)),
            creatingStory.inputType === 'image' ? creatingStory.outputText[creatingStory.index]
                : (
                    creatingStory.inputText ?
                        creatingStory.inputText.concat(creatingStory.outputText[creatingStory.index])
                        : creatingStory.outputText[creatingStory.index]
                )
        ].join('\n\n');
        const totalLength = storylineIntoChunk.length;
        const offset = 1220;
        const numOfLoops = parseInt(totalLength / offset);
        const splitedIntoOffsetChunks = [];
        for (let i = 0; i <= numOfLoops; i += 1) {
            splitedIntoOffsetChunks.push(storylineIntoChunk.slice(offset * i, offset * (i + 1)));
        }
        console.log(splitedIntoOffsetChunks);
        setEntireStory([...splitedIntoOffsetChunks]);
    }, [])

    return (
        <div>
            {
                storyData.pageCoverDataURL &&
                <MobileTitlePage>
                    <MobiletitlePageSection>
                        <MobileTitleImage src={storyData.pageCoverDataURL} />
                    </MobiletitlePageSection>
                </MobileTitlePage>
            }
            {
                (createdStory.length !== 0 && createdStory !== null && entireStory.legnth !== 0) &&
                entireStory.map((v, i) => (
                    <MobileTextPage key={`${i}_page`}>
                        <MobileSection key={`${i}_view`}>
                            <MobileTextArea key={`${i}_text`} >
                                {v}
                            </MobileTextArea>
                        </MobileSection>

                    </MobileTextPage>
                ))
            }
        </div>
    )
}

export default StorylineDocumentForMobile;